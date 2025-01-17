import type { IFolderRepository } from "../../repository/IFolderRepository";
import { FolderEntity } from '../../entities/FolderEntity';
import type { GetFolderResponse } from "../../response/GetFolderResponse";

export class GetFolderUseCase {
    constructor(private folderRepository: IFolderRepository) {}

    async execute(folderId: number | null): Promise<FolderEntity[]> {
        const folderData = await this.folderRepository.getAllFolders(folderId);

        return folderData.data.map((folder) => new FolderEntity(folder));
    }
}