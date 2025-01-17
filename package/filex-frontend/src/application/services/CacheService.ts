import type { ICacheService } from "../../domain/interfaces/ICacheService";
import type { FolderModel } from "../../domain/models/FolderModel";
import type { FileModel } from "../../domain/models/FileModel";
import type { CacheEntry } from "../../domain/shared/types/CacheEntry";

export class CacheService implements ICacheService {
  private cache: Map<number, CacheEntry> = new Map();
  private readonly DEFAULT_EXPIRY = 60000; // 1 minute

  async getFolderChildren(folderId: number): Promise<FolderModel[]> {
    const entry = this.cache.get(folderId);
    if (entry && Date.now() < entry.expiry) {
      return entry.data;
    }
    return [];
  }

  async setFolderChildren(folderId: number, folders: FolderModel[]): Promise<void> {
    this.cache.set(folderId, {
      name: `Folder ${folderId}`,
      data: folders,
      expiry: Date.now() + this.DEFAULT_EXPIRY,
      hasMore: false
    });
  }

  async updateFileCache(folderId: number, data: {
    files: FileModel[];
    hasMore: boolean;
  }): Promise<void> {
    const existing = this.cache.get(folderId);
    if (existing) {
      this.cache.set(folderId, {
        ...existing,
        files: data.files,
        hasMoreFiles: data.hasMore
      });
    }
  }

  getCacheEntry(folderId: number): CacheEntry | undefined {
    return this.cache.get(folderId);
  }

  clearCache(): void {
    this.cache.clear();
  }
}