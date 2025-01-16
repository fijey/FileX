import { Folder } from "../../entities/folder.entity";
import type { FolderAttributes } from "../../types/folder/folder.types";

export interface GetFolderQuery extends Pick<FolderAttributes, 'parent_id'> {}
export interface CreateFolderCommand extends Pick<FolderAttributes, 'name' | 'parent_id'> {}
export interface DeleteFolderCommand extends Pick<FolderAttributes, 'id'> {}
export interface UpdateFolderCommand extends Pick<FolderAttributes, 'id' | 'name' | 'parent_id'> {}