import type { FolderModel } from "../models/FolderModel";
import type { FileModel } from "../models/FileModel";
import type { CacheEntry } from "../shared/types/CacheEntry";

export interface ICacheService {
  getFolderChildren(folderId: number): Promise<FolderModel[]>;
  setFolderChildren(folderId: number, folders: FolderModel[]): Promise<void>;
  updateFileCache(folderId: number, data: {
    files: FileModel[];
    hasMore: boolean;
  }): Promise<void>;
  getCacheEntry(folderId: number): CacheEntry | undefined;
  clearCache(): void;
}