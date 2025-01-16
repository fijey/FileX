import type { File } from '../../../domain/entities/file.entity';
import type { UpdateFileCommand } from '../../../domain/ports/in/file.port';
import type { FileRepository } from '../../../domain/ports/out/file-repository.port';

export class UpdateFileUseCase {
    constructor(private fileRepository: FileRepository) {}

    async execute(updateFileCommand: UpdateFileCommand): Promise<File> {
        return this.fileRepository.update(updateFileCommand);
    }
}