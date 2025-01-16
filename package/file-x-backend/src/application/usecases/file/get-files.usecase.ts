import { File } from "../../../domain/entities/file.entity";
import type { GetFileQuery } from "../../../domain/ports/in/file.port";
import type { FileRepository } from "../../../domain/ports/out/file-repository.port";

export class GetFileUseCase {
    constructor(private readonly fileRepository: FileRepository) {}

    async execute(query: GetFileQuery): Promise<File[]> {
        return this.fileRepository.findByFolderId(query);
    }
}