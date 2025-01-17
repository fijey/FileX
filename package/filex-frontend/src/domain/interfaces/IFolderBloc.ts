import type { FolderEntity } from "../entities/FolderEntity";

export interface IFolderBloc {
    loadFolders(): Promise<void>;
    toggleFolderExpansion(folderId: number): Promise<void>;
    isFolderExpanded(folderId: number): boolean;
    readonly folderList: FolderEntity[];
}