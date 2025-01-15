import { Folder } from "../../entities/folder.entity";
import type { FolderAttributes } from "../../types/folder/folder.types";

export interface CreateFolderUsecase extends Pick<FolderAttributes, 'name' | 'parent_id'> {}
export interface GetFolderUsecase extends Pick<FolderAttributes, 'parent_id'> {}