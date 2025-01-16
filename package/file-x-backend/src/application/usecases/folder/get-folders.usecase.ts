import { Folder } from "../../../domain/entities/folder.entity";
import type { GetFolderQuery } from "../../../domain/ports/in/folder.port";
import type { FolderRepository } from "../../../domain/ports/out/folder-repository.port";

export class GetFolderUseCase {
    constructor(private readonly folderRepository: FolderRepository) {}

    async execute(query: GetFolderQuery): Promise<Folder[]> {
        return this.folderRepository.findByParentId(query);
    }
}