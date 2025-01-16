export interface FolderModel {
    id: number;
    name: string;
    parentId: number | null;
    children: FolderModel[];
    hasChildren: boolean;
  }
  