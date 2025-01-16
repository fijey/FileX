import type { FolderModel } from '../../data/models/FolderModel';

export interface IFolderRepository {
  getAllFolders(folderId: number | null): Promise<FolderModel[]>;
}
