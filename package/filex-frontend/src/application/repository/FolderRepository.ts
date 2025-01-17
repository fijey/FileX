import type { IFolderRepository } from "../../domain/repository/IFolderRepository";
import type { GetFolderResponse } from "../../domain/shared/response/GetFolderResponse";
import type { PaginationOptions } from '../../domain/shared/types/PaginationOptions';


export class FolderRepository implements IFolderRepository {
    async getAllFolders(folderId: number | null, page: PaginationOptions): Promise<GetFolderResponse> {
        const response = await fetch(
            `http://localhost:3000/api/v1/folders?` + 
            new URLSearchParams({
                parent_id: folderId?.toString() || '',
                page: (page.page ?? 1).toString(),
                limit: (page.limit ?? 10).toString()
            })
        );

        if (!response.ok) {
            throw new Error('Failed to get folders');
        }
        const result = await response.json()
        return result.data;
    }
}