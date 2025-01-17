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
        if (searchQuery) {
            const recursiveQuery = `
                WITH RECURSIVE FolderHierarchy AS (
                    -- Base case: start with the specified folder
                    SELECT id
                    FROM Folders 
                    WHERE id = ${file.folder_id}
                    
                    UNION ALL
                    
                    -- Recursive case: get all child folders
                    SELECT f.id
                    FROM Folders f
                    INNER JOIN FolderHierarchy fh ON f.parent_id = fh.id
                )
            `;

            const files = await this.prisma.$queryRaw<File[]>`
                ${Prisma.raw(recursiveQuery)}
                SELECT DISTINCT f.*
                FROM Files f
                WHERE f.folder_id IN (SELECT id FROM FolderHierarchy)
                AND f.name LIKE ${`%${searchQuery}%`}
                ORDER BY f.name ASC
                ${pagination ? Prisma.raw(`LIMIT ${pagination.limit} OFFSET ${((pagination.page || 1) - 1) * (pagination.limit || 1)}`) : Prisma.empty}
            `;

            const total = await this.prisma.$queryRaw<[{ count: number }]>`
                ${Prisma.raw(recursiveQuery)}
                SELECT COUNT(DISTINCT f.id) as count
                FROM Files f
                WHERE f.folder_id IN (SELECT id FROM FolderHierarchy)
                AND f.name LIKE ${`%${searchQuery}%`}
            `;

            return {
                data: files.map(file => new File(file)),
                total: Number(total[0].count)
            };
        }

        // If no search query, use regular pagination
        const baseQuery = {
            where: { folder_id: file.folder_id }
        };

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