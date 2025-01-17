import { defineStore } from 'pinia';
import { FolderEntity } from '../../domain/entities/FolderEntity';
import type { CacheEntry } from '../../domain/types/CacheEntry';
import type { FolderState } from '../../domain/types/FolderStore';
import type { FileEntity } from '../../domain/entities/FileEntity';

// Add FileCache type
interface FileCache {
  data: FileEntity[];
  hasMore: boolean;
  page: number;
}

export const useGlobalStore = defineStore('folder', {
  state: () : FolderState & { 
    fileResults: FileCache
  } => ({
    folders: [] as FolderEntity[],
    openFolderIds: {} as Record<number, boolean>,
    folderCache: new Map<number, CacheEntry>(),
    selectedFolderId: null as null | number,
    fileResults: {
      data: [],
      hasMore: false,
      page: 1
    }
  }),
  actions: {
    setFolders(folders: FolderEntity[]) {
      this.folders = folders;
    },
    toggleFolderExpansion(folderId: number) {
      this.openFolderIds[folderId] = !this.openFolderIds[folderId];
    },
    setFolderChildren(folderId: number, folderName: string, children: FolderEntity[], ttl: number = 60000, hasMore: boolean = false, shouldAppend: boolean = false) {
      const updateFoldersRecursively = (folders: FolderEntity[]): FolderEntity[] => {
        return folders.map(folder => {
          if (folder.id === folderId) {
            // If shouldAppend is true and there are existing children, append
            // Otherwise replace the children
            const existingChildren = this.folderCache.get(folderId)?.data || [];
            const updatedChildren = shouldAppend && existingChildren.length > 0 ? 
              [...existingChildren, ...children] : 
              children;
            return { ...folder, children: updatedChildren };
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

      // Update cache similarly
      const existingCache = this.folderCache.get(folderId);
      const existingData = existingCache?.data || [];
      const updatedData = shouldAppend && existingCache ? 
        [...existingData, ...children] : 
        children;

      const expiry = Date.now() + ttl;
      this.folderCache.set(folderId, { 
        name: folderName, 
        data: updatedData, 
        expiry,
        hasMore 
      });
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

    // Add file actions
    resetFiles() {
      this.fileResults = {
        data: [],
        hasMore: false,
        page: 1
      };
    },

    setFiles(files: FileEntity[], hasMore: boolean) {
      if (this.fileResults.page === 1) {
        this.fileResults.data = files;
      } else {
        this.fileResults.data = [...this.fileResults.data, ...files];
      }
      this.fileResults.hasMore = hasMore;
    },

    appendFiles(files: FileEntity[], hasMore: boolean) {
      this.fileResults.data = [...this.fileResults.data, ...files];
      this.fileResults.hasMore = hasMore;
      this.fileResults.page++;
    },

    setFilePage(page: number) {
      this.fileResults.page = page;
    },

    updateCacheFiles(folderId: number, updatedCache: CacheEntry) {
      this.folderCache.set(folderId, updatedCache);
    }
  },
  getters: {
    getFolders: (state) => state.folders,
    isFolderExpanded: (state) => (folderId: number) => state.openFolderIds[folderId] || false,
    selectedFolderContents: (state) : CacheEntry => state.selectedFolderId != null ? state.folderCache.get(state.selectedFolderId) as CacheEntry || [] : {
      name: '', data: [], expiry: 0,
      hasMore: false
    },
    getFolderContents: (state) => (folderId: number) => state.folderCache.get(folderId)?.data || [],

    // Add file getters
    getFiles: (state) => state.fileResults.data,
    hasMoreFiles: (state) => state.fileResults.hasMore,
    getCurrentFilePage: (state) => state.fileResults.page
  },
});

