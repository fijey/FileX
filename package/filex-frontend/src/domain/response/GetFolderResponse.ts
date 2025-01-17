import type { FolderModel } from '../../data/models/FolderModel';

export interface GetFolderResponse {
    data: FolderModel[];
    total?: number;
}