import type { FolderModel } from '../../data/models/FolderModel';

export interface GetFolderResponse {
    data: {
        data: FolderModel[];
        total?: number;
        hasMore: boolean;
    }
}