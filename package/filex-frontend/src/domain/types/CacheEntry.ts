import { FolderEntity } from '../entities/FolderEntity';

export interface CacheEntry {
    name: string;
    data: FolderEntity[];
    expiry: number;
    hasMore: boolean;
}