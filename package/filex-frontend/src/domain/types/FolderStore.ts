import type { FolderEntity } from "../entities/FolderEntity";
import type { CacheEntry } from "./CacheEntry";

export interface FolderState {
    folders: FolderEntity[];
    openFolderIds: Record<number, boolean>;
    folderCache: Map<number, CacheEntry>;
    selectedFolderId: number | null;
  }