import type { FileModel } from "../models/FileModel";

export interface IFileModel {
    id: number;
    name: string;
    folderId: number | null;
    children?: FileModel[];
    hasChildren?: boolean;
  }