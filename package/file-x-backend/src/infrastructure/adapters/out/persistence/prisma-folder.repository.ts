import { PrismaClient } from '@prisma/client';
import { Folder } from '../../../../domain/entities/folder.entity';
import { PaginationOptions } from '../../../../domain/types/pagination-options.type';
import type { CreateFolderRepository, DeleteFolderRepository, FolderRepository, GetFolderRepository, UpdateFolderRepository } from '../../../../domain/ports/out/folder-repository.port';

export class PrismaFolderRepository implements FolderRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findByParentId(folder: GetFolderRepository, pagination?: PaginationOptions): Promise<{ data: Folder[], total?: number }> {
        const baseQuery = {
            where: { parent_id: folder.parent_id },
            include: { 
                _count: {
                    select: {
                        children: true
                    }
                }
            }
        };

        // If pagination is requested
        if (pagination?.page && pagination?.limit) {
            const skip = (pagination.page - 1) * pagination.limit;
            
            // Execute count and data query in parallel for better performance
            const [total, folders] = await Promise.all([
                // Get total count
                this.prisma.folders.count({
                    where: { parent_id: folder.parent_id }
                }),
                // Get paginated data
                this.prisma.folders.findMany({
                    ...baseQuery,
                    skip,
                    take: pagination.limit,
                    orderBy: {
                        name: 'asc'
                    }
                })
            ]);

            return {
                data: folders.map(folder => ({
                    ...folder,
                    hasChildren: folder._count.children > 0
                })),
                total
            };
        }

        // If no pagination, return all results
        const folders = await this.prisma.folders.findMany(baseQuery);
        
        return {
            data: folders.map(folder => {
                const { _count, ...rest } = folder;
                return {
                    ...rest,
                    hasChildren: folder._count.children > 0
                };
            })
        };
    }

    async create(command: CreateFolderRepository): Promise<Folder> {
        const folder = await this.prisma.folders.create({
            data: command
        });
        return new Folder(folder);
    }

    async delete(folder: DeleteFolderRepository): Promise<string> {
        await this.prisma.folders.delete({
            where: { id: folder.id }
        });
        return 'Folder deleted successfully';
    }

    async update(folder: UpdateFolderRepository): Promise<Folder> {
        const updatedFolder = await this.prisma.folders.update({
            where: { id: folder.id },
            data: folder
        });
        return new Folder(updatedFolder);
    }
}