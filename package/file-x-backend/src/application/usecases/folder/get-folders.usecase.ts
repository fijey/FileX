import { Folder } from "../../../domain/entities/folder.entity";
import type { GetFolderUsecase } from "../../../domain/ports/in/folder.port";
import type { FolderRepository } from "../../../domain/ports/out/folder-repository.port";

export class GetFolder {
    constructor(private readonly folderRepository: FolderRepository) {}

    async execute(query: GetFolderUsecase): Promise<Folder[]> {
        return this.folderRepository.findByParentId(query);
    }
}