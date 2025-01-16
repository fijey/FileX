import type { DeleteFileCommand } from '../../../domain/ports/in/file.port';
import type { FileRepository } from '../../../domain/ports/out/file-repository.port';

export class DeleteFileUseCase {
    constructor(private folderRepository: FileRepository) {}

    async execute(deleteFolderCommand: DeleteFileCommand): Promise<string> {
        return this.folderRepository.delete(deleteFolderCommand);
    }
}