import type { PaginationOptions } from '../../../../file-x-backend/src/domain/types/pagination-options';
import type { FolderModel } from '../../data/models/FolderModel';
import type { GetFolderResponse } from '../response/GetFolderResponse';

export interface IFolderRepository {
  getAllFolders(folderId: number | null, pagination: PaginationOptions): Promise<GetFolderResponse>;
}
