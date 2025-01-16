import type { IFolderRepository } from "../../repository/IFolderRepository";
import { FolderEntity } from '../../entities/FolderEntity';

export class GetFolderUseCase {
    constructor(private folderRepository: IFolderRepository) {}

    async execute(): Promise<FolderEntity[]> {
        const folderData = await this.folderRepository.getAllFolders();

        return folderData.map((folder) => new FolderEntity(folder.id, folder.name, folder.parentId));
    }
}