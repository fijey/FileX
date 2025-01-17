export interface FileModel {
    id: number;
    name: string;
    folderId: number | null;
    children: FileModel[];
    hasChildren: boolean;
  }
  