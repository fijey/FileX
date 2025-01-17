import type { PaginationOptions } from '../../../../file-x-backend/src/domain/types/pagination-options';
import type { GetFolderResponse } from '../shared/response/GetFolderResponse';

export interface IFolderRepository {
  getAllFolders(folderId: number | null, pagination: PaginationOptions): Promise<GetFolderResponse>;
}
