import type { FolderModel } from "../models/FolderModel";

export interface IFolderModel {
    id: number;
    name: string;
    parentId: number | null;
    isActive?: boolean;
    children?: FolderModel[];
    hasChildren?: boolean;
  }
  