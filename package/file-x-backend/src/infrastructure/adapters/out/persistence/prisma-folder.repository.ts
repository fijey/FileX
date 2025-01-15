// src/infrastructure/adapters/out/persistence/prisma-folder.repository.ts
import { PrismaClient } from '@prisma/client';
import { Folder } from '../../../../domain/entities/folder.entity';
import type { CreateFolderRepository, FolderRepository, GetFolderRepository } from '../../../../domain/ports/out/folder-repository.port';

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
}