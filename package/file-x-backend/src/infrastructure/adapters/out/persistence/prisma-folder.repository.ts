// src/infrastructure/adapters/out/persistence/prisma-folder.repository.ts
import { PrismaClient } from '@prisma/client';
import { Folder } from '../../../../domain/entities/folder.entity';
import type { CreateFolderRepository, DeleteFolderRepository, FolderRepository, GetFolderRepository } from '../../../../domain/ports/out/folder-repository.port';

export class PrismaFolderRepository implements FolderRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findByParentId(folder: GetFolderRepository): Promise<Folder[]> {
        const folders = await this.prisma.folders.findMany({
            where: { parent_id: folder.parent_id },
            include: { Files: true }
        });
        return folders.map(folder => new Folder(folder));
    }

    async create(command: CreateFolderRepository): Promise<Folder> {
        const folder = await this.prisma.folders.create({
            data: command
        });
        return new Folder(folder);
    }

    async delete(folder: DeleteFolderRepository): Promise<string> {
        console.log(folder);
        await this.prisma.folders.delete({
            where: { id: folder.id }
        });
        return 'Folder deleted successfully';
    }
}