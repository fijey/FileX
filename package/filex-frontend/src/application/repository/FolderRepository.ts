import type { PaginationOptions } from "../../../../file-x-backend/src/domain/types/pagination-options";
import type { IFolderRepository } from "../../domain/repository/IFolderRepository";
import type { GetFolderResponse } from "../../domain/response/GetFolderResponse";


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

        return await response.json();
    }
}