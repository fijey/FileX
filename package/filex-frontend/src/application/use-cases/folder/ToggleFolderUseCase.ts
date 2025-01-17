import type { ICacheService } from "../../../domain/interfaces/ICacheService";
import type { FolderModel } from "../../../domain/models/FolderModel";
import type { IFolderRepository } from "../../../domain/repository/IFolderRepository";
import type { GetFolderResponse } from "../../../domain/shared/response/GetFolderResponse";

export class ToggleFolderUseCase {
    constructor(
        private folderRepository: IFolderRepository,
        private cacheService: ICacheService
    ) {}

    async execute(folderId: number, folderName: string) : Promise<GetFolderResponse> {
        const cachedData = await this.cacheService.getFolderChildren(folderId);
        if (cachedData.length > 0) {
            return {
                data: cachedData,
                hasMore: false
            };
        }

        const response = await this.folderRepository.getAllFolders(
            folderId, 
            { page: 1, limit: 25 }
        );
        await this.cacheService.setFolderChildren(folderId, response.data);
        return {
            data: response.data,
            hasMore: response.hasMore
        };
    }
}