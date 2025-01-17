import type { IFolderRepository } from "../../../domain/repository/IFolderRepository";
import { FolderModel } from '../../../domain/models/FolderModel';
import type { GetFolderResponse } from "../../../domain/response/GetFolderResponse";
import type { PaginationOptions } from '../../../../../file-x-backend/src/domain/types/pagination-options';

export class GetFolderUseCase {
    constructor(private folderRepository: IFolderRepository) {}

    async execute(folderId: number | null, pagination: PaginationOptions): Promise<GetFolderResponse> {
        const folderData = await this.folderRepository.getAllFolders(folderId, pagination);
        
        return folderData;
    }
}