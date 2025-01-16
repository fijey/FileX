import type { Folder } from '../../../domain/entities/folder.entity';
import type { UpdateFolderCommand } from '../../../domain/ports/in/folder.port';
import type { FolderRepository } from '../../../domain/ports/out/folder-repository.port';

export class UpdateFolderUseCase {
    constructor(private folderRepository: FolderRepository) {}

    async execute(updateFolderCommand: UpdateFolderCommand): Promise<Folder> {
        return this.folderRepository.update(updateFolderCommand);
    }
}