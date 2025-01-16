import { Folder } from "../../entities/folder.entity";
import type { FolderAttributes } from "../../types/folder/folder.types";

export interface CreateFolderRepository extends Omit<FolderAttributes, 'id'> {}
export interface GetFolderRepository extends Pick<FolderAttributes, 'parent_id'> {}
export interface DeleteFolderRepository extends Pick<FolderAttributes, 'id'> {}
export interface UpdateFolderRepository extends Pick<FolderAttributes, 'id' | 'name' | 'parent_id'> {}


export interface FolderRepository {
    findByParentId(folder: GetFolderRepository): Promise<Folder[]>;
    create(folder: CreateFolderRepository): Promise<Folder>;
    delete(folder: DeleteFolderRepository): Promise<string>;
    update(folder: UpdateFolderRepository): Promise<Folder>;
}