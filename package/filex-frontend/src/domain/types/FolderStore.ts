import type { FolderModel } from "../models/FolderModel";
import type { CacheEntry } from "./CacheEntry";

export interface FolderState {
    folders: FolderModel[];
    openFolderIds: Record<number, boolean>;
    folderCache: Map<number, CacheEntry>;
    selectedFolderId: number | null;
  }