import type { DeleteFileUseCase } from '../../../domain/ports/in/file.port';
import type { FileRepository } from '../../../domain/ports/out/file-repository.port';

export class DeleteFile {
    constructor(private folderRepository: FileRepository) {}

    async execute(deleteFolderCommand: DeleteFileUseCase): Promise<string> {
        return this.folderRepository.delete(deleteFolderCommand);
    }
}