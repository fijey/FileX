import { File } from "../../../domain/entities/file.entity";
import type { GetFileUsecase } from "../../../domain/ports/in/file.port";
import type { FileRepository } from "../../../domain/ports/out/file-repository.port";

export class GetFile {
    constructor(private readonly fileRepository: FileRepository) {}

    async execute(query: GetFileUsecase): Promise<File[]> {
        return this.fileRepository.findByFolderId(query);
    }
}