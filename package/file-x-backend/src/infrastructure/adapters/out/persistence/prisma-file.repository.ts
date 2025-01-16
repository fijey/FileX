import { PrismaClient } from '@prisma/client';
import { File } from '../../../../domain/entities/file.entity';
import type { CreateFileRepository, DeleteFileRepository, FileRepository, GetFileRepository, UpdateFileRepository } from '../../../../domain/ports/out/file-repository.port';

export class PrismaFileRepository implements FileRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findByFolderId(file: GetFileRepository): Promise<File[]> {
        const files = await this.prisma.files.findMany({
            where: { folder_id: file.folder_id },
            include: { folder: true }
        });
        return files.map(file => new File(file));
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