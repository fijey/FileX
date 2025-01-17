import type { IFileRepository } from "../../domain/repository/IFileRepository";
import type { GetFileResponse } from "../../domain/shared/response/GetFileResponse";
import type { PaginationOptions } from '../../domain/shared/types/PaginationOptions';
export class FileRepository implements IFileRepository {
  private readonly API_URL = 'http://localhost:3000/api/v1';

  async getAllFiles(folderId: number | null, pagination: PaginationOptions): Promise<GetFileResponse> {
    const response = await fetch(
      `${this.API_URL}/files?` + 
      new URLSearchParams({
        folder_id: folderId?.toString() || '',
        page: pagination.page?.toString() || '1',
        limit: pagination.limit?.toString() || '10'
      })
    );

    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }

    const data = await response.json();
    return {
      data: data.data.data,
      total: data.data.total,
      hasMore: data.data.hasMore
    };
  }
}