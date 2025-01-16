import { File } from '../../../domain/entities/file.entity';
import type { CreateFileCommand } from '../../../domain/ports/in/file.port';
import type { FileRepository } from '../../../domain/ports/out/file-repository.port';

export class CreateFileUseCase {
    constructor(private fileRepository: FileRepository) {}

    async execute(createFileCommand: CreateFileCommand): Promise<File> {
        return this.fileRepository.create(createFileCommand);
    }
}