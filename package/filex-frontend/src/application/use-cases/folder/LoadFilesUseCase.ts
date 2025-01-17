import type { ICacheService } from "../../../domain/interfaces/ICacheService";
import type { IFileRepository } from "../../../domain/repository/IFileRepository";

export class LoadFilesUseCase {
    constructor(
        private fileRepository: IFileRepository,
        private cacheService: ICacheService
    ) {}

    async execute(folderId: number, page: number = 1) {
        const response = await this.fileRepository.getAllFiles(folderId, { 
            page, 
            limit: 10 
        });

        await this.cacheService.updateFileCache(folderId, {
            files: response.data,
            hasMore: response.hasMore
        });

        return response;
    }
}