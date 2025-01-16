import type { DeleteFolderUseCase } from '../../../domain/ports/in/folder.port';
import type { FolderRepository } from '../../../domain/ports/out/folder-repository.port';

export class DeleteFolder {
    constructor(private folderRepository: FolderRepository) {}

    async execute(deleteFolderCommand: DeleteFolderUseCase): Promise<string> {
        console.log(deleteFolderCommand);
        return this.folderRepository.delete(deleteFolderCommand);
    }
}