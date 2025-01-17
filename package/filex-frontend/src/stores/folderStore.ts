import { defineStore } from 'pinia';
import { FolderEntity } from '../domain/entities/FolderEntity';
import type { CacheEntry } from '../domain/types/CacheEntry';
import type { FolderState } from '../domain/types/FolderStore';


export const useFolderStore = defineStore('folder', {
  state: () : FolderState => ({
    folders: [] as FolderEntity[],
    openFolderIds: {} as Record<number, boolean>,
    folderCache: new Map<number, CacheEntry>(),
    selectedFolderId: null as null | number,
  }),
  actions: {
    setFolders(folders: FolderEntity[]) {
      this.folders = folders;
    },
    toggleFolderExpansion(folderId: number) {
      this.openFolderIds[folderId] = !this.openFolderIds[folderId];
    },
    cacheFolderContents(folderId: number, children: FolderEntity[], ttl: number = 60000) {
      this.setFolderChildren(folderId, children);
      this.cacheFolder(folderId, children, ttl);
    },
    setFolderChildren(folderId: number, children: FolderEntity[], ttl: number = 60000) {
      const updateFoldersRecursively = (folders: FolderEntity[]): FolderEntity[] => {
        return folders.map(folder => {
          if (folder.id === folderId) {
            return { ...folder, children };
          }
          if (folder.children?.length) {
            return {
              ...folder,
              children: updateFoldersRecursively(folder.children),
            };
          }
          return folder;
        });
      };

      this.folders = updateFoldersRecursively(this.folders);

      const expiry = Date.now() + ttl;
      this.folderCache.set(folderId, { data: children, expiry });
    },
    
    clearCache() {
      this.folderCache.clear();
    },
    fetchFolderChildren(folderId: number): FolderEntity[] {
      const cacheEntry = this.folderCache.get(folderId);
      if (cacheEntry) {
        if (cacheEntry.expiry > Date.now()) {
          return cacheEntry.data;
        } else {
          this.folderCache.delete(folderId);
        }
      }
      return [];
    },
    setCurrentFolderActive(folderId: number) {
      this.selectedFolderId = folderId;
    },
     cacheFolder(folderId: number, data: FolderEntity[], ttl: number) {
      const expiry = Date.now() + ttl;
      this.folderCache.set(folderId, { data, expiry });
    },
    cleanExpiredCache() {
      const now = Date.now();
      for (const [key, value] of this.folderCache.entries()) {
        if (value.expiry < now) {
          this.folderCache.delete(key);
        }
      }
    }
  },
  getters: {
    getFolders: (state) => state.folders,
    isFolderExpanded: (state) => (folderId: number) => state.openFolderIds[folderId] || false,
    selectedFolderContents: (state) => state.selectedFolderId != null ? state.folderCache.get(state.selectedFolderId)?.data || [] : [],
    getFolderContents: (state) => (folderId: number) => state.folderCache.get(folderId)?.data || [],
  },
});

