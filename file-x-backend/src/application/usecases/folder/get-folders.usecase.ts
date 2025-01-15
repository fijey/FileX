import { Folder } from "../../../domain/entities/folder.entity";
import type { FolderRepositoryPort } from "../../../domain/ports/out/folder-repository.port";

export class GetFolderUseCase {
    constructor(private readonly folderRepository: FolderRepositoryPort) {}

    async execute(parent_id: number | null): Promise<Folder[]> {
        return this.folderRepository.findByParentId(parent_id);
    }
}