import type { Folder } from '../../../domain/entities/folder.entity';
import type { UpdateFolderUseCase } from '../../../domain/ports/in/folder.port';
import type { FolderRepository } from '../../../domain/ports/out/folder-repository.port';

export class UpdateFolder {
    constructor(private folderRepository: FolderRepository) {}

    async execute(updateFolderCommand: UpdateFolderUseCase): Promise<Folder> {
        return this.folderRepository.update(updateFolderCommand);
    }
}