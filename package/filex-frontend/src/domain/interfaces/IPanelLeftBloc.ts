import type { FolderModel } from "../models/FolderModel";

export interface IPanelLeftBloc {
    loadFolders(): Promise<void>;
    toggleFolderExpansion(folderId: number, folderName: string): Promise<void>;
    isFolderExpanded(folderId: number): boolean;
    readonly folderList: FolderModel[];
}