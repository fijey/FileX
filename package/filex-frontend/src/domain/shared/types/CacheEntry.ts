import type { FileModel } from '../../models/FileModel';
import type { FolderModel } from '../../models/FolderModel';

export interface CacheEntry {
    name: string;
    data: FolderModel[];
    files?: FileModel[];
    expiry: number;
    hasMore: boolean;
    hasMoreFiles?: boolean;
}