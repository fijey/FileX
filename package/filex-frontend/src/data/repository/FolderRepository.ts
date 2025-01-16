import type { IFolderRepository } from "../../domain/repository/IFolderRepository";
import type { FolderModel } from "../models/FolderModel";


export class FolderRepository implements IFolderRepository {
    async getAllFolders(): Promise<FolderModel[]> {
        const response = await fetch('http://localhost:3000/api/v1/folders');
        if (!response.ok) {
            throw new Error('Failed to get folders');
        }

        const data = await response.json();

        return data?.data;
    }
}