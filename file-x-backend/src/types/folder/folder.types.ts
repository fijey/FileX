export interface FolderInterface {
    id: number;
    name: string;
    parent_id: number | null;
}

export interface CreateFolderInterface {
    name: string;
    parent_id: number | null;
}