import { File } from '../../../domain/entities/file.entity';
import type { CreateFileUsecase } from '../../../domain/ports/in/file.port';
import type { FileRepository } from '../../../domain/ports/out/file-repository.port';

export class CreateFile {
    constructor(private fileRepository: FileRepository) {}

    async execute(createFileCommand: CreateFileUsecase): Promise<File> {
        return this.fileRepository.create(createFileCommand);
    }
}