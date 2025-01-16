import { FolderEntity } from '../entities/FolderEntity';

export interface CacheEntry {
    data: FolderEntity[];
    expiry: number;
}