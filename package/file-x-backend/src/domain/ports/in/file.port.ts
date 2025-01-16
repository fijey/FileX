import type { FileAttributes } from "../../types/file/file.types";

export interface GetFileQuery extends Pick<FileAttributes, 'folder_id'> {}
export interface CreateFileCommand extends Pick<FileAttributes, 'name' | 'folder_id'> {}
export interface DeleteFileCommand extends Pick<FileAttributes, 'id'> {}
export interface UpdateFileCommand extends Pick<FileAttributes, 'id' | 'name' | 'folder_id'> {}