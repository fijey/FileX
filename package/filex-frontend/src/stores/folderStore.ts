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
    setFolderChildren(folderId: number, folderName: string, children: FolderEntity[], ttl: number = 60000) {
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
      this.folderCache.set(folderId, { name: folderName, data: children, expiry });
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
  },
  getters: {
    getFolders: (state) => state.folders,
    isFolderExpanded: (state) => (folderId: number) => state.openFolderIds[folderId] || false,
    selectedFolderContents: (state) : CacheEntry => state.selectedFolderId != null ? state.folderCache.get(state.selectedFolderId) as CacheEntry || [] : { name: '', data: [], expiry: 0 },
    getFolderContents: (state) => (folderId: number) => state.folderCache.get(folderId)?.data || [],
  },
});

