import type { File } from '../../../domain/entities/file.entity';
import type { UpdateFileUseCase } from '../../../domain/ports/in/file.port';
import type { FileRepository } from '../../../domain/ports/out/file-repository.port';

export class UpdateFile {
    constructor(private fileRepository: FileRepository) {}

    async execute(updateFileCommand: UpdateFileUseCase): Promise<File> {
        return this.fileRepository.update(updateFileCommand);
    }
}