import { defineStore } from 'pinia';
import { FolderEntity } from '../domain/entities/FolderEntity';
import type { CacheEntry } from '../domain/types/CacheEntry';

export const useFolderStore = defineStore('folder', {
  state: () => ({
    folders: [] as FolderEntity[],
    isOpen: {} as Record<string, boolean>,
    folderCache: new Map<number, CacheEntry>(),
    currentFolderActive: null as null | number,
  }),
  actions: {
    setFolders(folders: FolderEntity[]) {
      this.folders = folders;
    },
    toggleFolder(folderId: number) {
      this.isOpen[folderId] = !this.isOpen[folderId];
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
      this.currentFolderActive = folderId;
    }
  },
  getters: {
    getFolders: (state) => state.folders,
    isFolderOpen: (state) => (folderId: number) => state.isOpen[folderId] || false,
    getCurrentActiveFolder: (state) => state.currentFolderActive != null ? state.folderCache.get(state.currentFolderActive)?.data || [] : [],
    getFolderFromCache: (state) => (folderId: number) => state.folderCache.get(folderId)?.data || [],
  },
});
