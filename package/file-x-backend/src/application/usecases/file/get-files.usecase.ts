import { File } from "../../../domain/entities/file.entity";
import type { GetFileQuery } from "../../../domain/ports/in/file.port";
import type { FileRepository } from "../../../domain/ports/out/file-repository.port";
import { PaginationOptions } from "../../../domain/types/pagination-options";

export class GetFileUseCase {
    constructor(private readonly fileRepository: FileRepository) {}

    async execute(query: GetFileQuery, pagination: PaginationOptions, search: string): Promise<{ data: File[], total?: number }> {
        return this.fileRepository.findByFolderId(query, pagination, search);
    }
}