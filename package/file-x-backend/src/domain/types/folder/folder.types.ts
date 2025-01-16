export interface FolderAttributes {
    id: number;
    name: string;
    parent_id: number | null;
    hasChildren?: boolean;
}