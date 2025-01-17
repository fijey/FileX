import type { FolderModel } from '../models/FolderModel';

export interface GetFolderResponse {
    data: FolderModel[];
    total?: number;
    hasMore: boolean;
}