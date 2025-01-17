import { FileModel } from '../../models/FileModel';

export interface GetFileResponse {
    data: FileModel[];
    total?: number;
    hasMore: boolean;
}