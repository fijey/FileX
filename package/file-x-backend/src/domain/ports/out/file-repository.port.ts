import { File } from "../../entities/file.entity";
import type { FileAttributes } from "../../types/file/file.types";

export interface CreateFileRepository extends Omit<FileAttributes, 'id'> {}
export interface GetFileRepository extends Pick<FileAttributes, 'folder_id'> {}
export interface DeleteFileRepository extends Pick<FileAttributes, 'id'> {}
export interface UpdateFileRepository extends Pick<FileAttributes, 'id' | 'name' | 'folder_id'> {}


export interface FileRepository {
    findByFolderId(file: GetFileRepository, pagination?: PaginationOptions, searchQuery?: string): Promise<{ data: File[], total?: number }>;
    create(file: CreateFileRepository): Promise<File>;
    delete(file: DeleteFileRepository): Promise<string>;
    update(file: UpdateFileRepository): Promise<File>;
}