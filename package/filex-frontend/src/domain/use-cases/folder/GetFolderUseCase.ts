import type { IFolderRepository } from "../../repository/IFolderRepository";
import { FolderEntity } from '../../entities/FolderEntity';
import type { GetFolderResponse } from "../../response/GetFolderResponse";
import type { PaginationOptions } from '../../../../../file-x-backend/src/domain/types/pagination-options';

export class GetFolderUseCase {
    constructor(private folderRepository: IFolderRepository) {}

    async execute(folderId: number | null, pagination: PaginationOptions): Promise<GetFolderResponse> {
        const folderData = await this.folderRepository.getAllFolders(folderId, pagination);
        
        return {
            data: {
                data: folderData.data.data.map((folder) => new FolderEntity(folder)),
                hasMore: folderData.data.hasMore,
                total: folderData.data.total
            }
        };
    }
}