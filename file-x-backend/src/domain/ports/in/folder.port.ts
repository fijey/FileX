import { Folder } from "../../entities/folder.entity";

export interface CreateFolderInterface {
    name: string;
    parent_id: number | null;
}

export interface FolderPort {
    getFolders(parent_id: number | null): Promise<Folder[]>;
    createFolder(folder: CreateFolderInterface): Promise<Folder>;
}