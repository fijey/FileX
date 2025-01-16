import type { FolderModel } from '../../data/models/FolderModel';

export interface IFolderRepository {
  getAllFolders(): Promise<FolderModel[]>;
}
