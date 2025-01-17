import type { FolderModel } from '../../data/models/FolderModel';
import type { GetFolderResponse } from '../response/GetFolderResponse';

export interface IFolderRepository {
  getAllFolders(folderId: number | null): Promise<GetFolderResponse>;
}
