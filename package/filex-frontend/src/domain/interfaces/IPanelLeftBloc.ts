import type { FolderEntity } from "../entities/FolderEntity";

export interface IPanelLeftBloc {
    loadFolders(): Promise<void>;
    toggleFolderExpansion(folderId: number, folderName: string): Promise<void>;
    isFolderExpanded(folderId: number): boolean;
    readonly folderList: FolderEntity[];
}