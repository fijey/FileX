// interface FolderContext {
//     id?: string;
// }

import { FolderService } from "../../services/folder/folder.services";
import type { CreateFolderInterface, FolderInterface } from "../../types/folder/folder.types";

export class FolderController {
    private folderService: FolderService;

    constructor() {
        this.folderService = new FolderService();
    }

    async getFolder(parent_id: number | null): Promise<FolderInterface[]> {
        try {
            const folders = this.folderService.getFolders(parent_id);
            
            return folders;
        } catch (error) {
            throw new Error('Failed to fetch root folders');
        }
    }

    async createFolder(folder: CreateFolderInterface): Promise<FolderInterface> {
        try {
            const newFolder = this.folderService.createFolder(folder);

            return newFolder;
        } catch (error) {
            throw new Error('Failed to create folder');
        }
    }
}

export default new FolderController();