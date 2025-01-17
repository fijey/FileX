import { Prisma, PrismaClient } from '@prisma/client';
import { File } from '../../../../domain/entities/file.entity';
import type { CreateFileRepository, DeleteFileRepository, FileRepository, GetFileRepository, UpdateFileRepository } from '../../../../domain/ports/out/file-repository.port';
import { PaginationOptions } from '../../../../domain/types/pagination-options';

export class PrismaFileRepository implements FileRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findByFolderId(file: GetFileRepository, pagination?: PaginationOptions, searchQuery?: string): Promise<{ data: File[], total?: number }> {
        const baseQuery = {
            where: { 
                folder_id: file.folder_id,
                ...(searchQuery && {
                    name: {
                        contains: searchQuery
                    }
                })
            }
        };

        // If pagination is provided
        if (pagination?.page && pagination?.limit) {
            const skip = (pagination.page - 1) * pagination.limit;
            
            const [total, files] = await Promise.all([
                this.prisma.files.count(baseQuery),
                this.prisma.files.findMany({
                    ...baseQuery,
                    skip,
                    take: pagination.limit,
                    orderBy: {
                        name: 'asc'
                    }
                })
            ]);

            return {
                data: files.map(file => new File(file)),
                total
            };
        }

        // If no pagination, return all results
        const files = await this.prisma.files.findMany({
            ...baseQuery,
            orderBy: {
                name: 'asc'
            }
        });
        
        return {
            data: files.map(file => new File(file))
        };
    }

    async create(command: CreateFileRepository): Promise<File> {
        const file = await this.prisma.files.create({
            data: command
        });
        return new File(file);
    }

    async delete(file: DeleteFileRepository): Promise<string> {
        await this.prisma.files.delete({
            where: { id: file.id }
        });
        return 'File deleted successfully';
    }

    async update(file: UpdateFileRepository): Promise<File> {
        const updatedFile = await this.prisma.files.update({
            where: { id: file.id },
            data: file
        });
        return new File(updatedFile);
    }
}