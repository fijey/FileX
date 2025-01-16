export interface FolderModel {
    id: string;
    name: string;
    parentId: string | null;
    children: FolderModel[];
  }
  