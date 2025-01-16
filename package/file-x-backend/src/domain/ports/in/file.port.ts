import { File } from "../../entities/file.entity";
import type { FileAttributes } from "../../types/file/file.types";

export interface CreateFileUsecase extends Pick<FileAttributes, 'name' | 'folder_id'> {}
export interface GetFileUsecase extends Pick<FileAttributes, 'folder_id'> {}
export interface DeleteFileUseCase extends Pick<FileAttributes, 'id'> {}
export interface UpdateFileUseCase extends Pick<FileAttributes, 'id' | 'name' | 'folder_id'> {}