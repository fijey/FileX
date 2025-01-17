import type { DeleteFolderCommand } from '../../../domain/ports/in/folder.port';
import type { FolderRepository } from '../../../domain/ports/out/folder-repository.port';

export class DeleteFolderUseCase {
    constructor(private folderRepository: FolderRepository) {}

    async execute(deleteFolderCommand: DeleteFolderCommand): Promise<string> {
        return this.folderRepository.delete(deleteFolderCommand);
    }
}