import { PrismaClient } from '@prisma/client';
import type { CreateFolderInterface } from '../../types/folder/folder.types';

const prisma = new PrismaClient();

export class FolderService {
    async getFolders(parent_id: number | null) {
        console.log('parent_id', parent_id);
        return await prisma.folders.findMany({
            where: {
                parent_id: parent_id
            },
            include: {
                Files: true
            }
        });
    }
    async createFolder(folder: CreateFolderInterface) {
        return await prisma.folders.create({
            data: folder
        });
    }
}