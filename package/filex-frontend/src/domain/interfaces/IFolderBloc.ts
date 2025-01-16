import type { FolderEntity } from "../entities/FolderEntity";

export interface IFolderBloc {
    loadFolders(): Promise<void>;
    toggleFolder(folderId: number): Promise<void>;
    isFolderOpen(folderId: number): boolean;
    readonly folderList: FolderEntity[];
}