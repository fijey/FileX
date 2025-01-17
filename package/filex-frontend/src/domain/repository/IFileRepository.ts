import type { PaginationOptions } from '../../../../file-x-backend/src/domain/types/pagination-options';
import type { GetFileResponse } from '../shared/response/GetFileResponse';

export interface IFileRepository {
  getAllFiles(folderId: number | null, pagination: PaginationOptions): Promise<GetFileResponse>;
}
