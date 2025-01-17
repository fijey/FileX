import type { FileEntity } from '../entities/FileEntity';
import type { FolderEntity } from '../entities/FolderEntity';

export interface CacheEntry {
    name: string;
    data: FolderEntity[];
    files?: FileEntity[];
    expiry: number;
    hasMore: boolean;
    hasMoreFiles?: boolean;
}