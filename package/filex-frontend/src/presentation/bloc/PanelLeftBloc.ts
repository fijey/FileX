import { FolderEntity } from '../../domain/entities/FolderEntity';
import type { IPanelLeftBloc } from '../../domain/interfaces/IPanelLeftBloc';
import { GetFolderUseCase } from '../../domain/use-cases/folder/GetFolderUseCase';
import { useGlobalStore } from '../stores/globalStore';
import { toRaw } from '../../domain/utils/reactivity';
import { useSearchStore } from '../stores/searchStore';
import { ref } from 'vue';
import type { FileEntity } from '../../domain/entities/FileEntity';

export class PanelLeftBloc implements IPanelLeftBloc {
  private store = useGlobalStore();
  private searchStore = useSearchStore();
  private currentPage = ref(1);
  private isLoadingFiles = false;

  constructor(private getFoldersUseCase: GetFolderUseCase) {}

  async loadFolders() {
    const result = await this.getFoldersUseCase.execute(null, { page: 1, limit: 10 });
    const { data: folders, hasMore } = result.data;
    this.store.setFolders(folders);
    this.store.setFolderChildren(0, '', folders, 60000, hasMore);
  }

  async toggleFolderExpansion(folderId: number, folderName: string) {
    this.store.toggleFolderExpansion(folderId);

    if (this.isFolderExpanded(folderId)) {
        const cachedData = this.store.fetchFolderChildren(folderId);
        if (cachedData.length > 0) {
            this.store.setFolderChildren(folderId, folderName, cachedData);
        } else {
            const response = await this.getFoldersUseCase.execute(folderId, { page: 1, limit: 10 });
            const { data: folders, hasMore } = response.data;
            this.store.setFolderChildren(folderId, folderName, folders, 60000, hasMore);
        }
    }
  }

  isFolderExpanded(folderId: number): boolean {
    return this.store.isFolderExpanded(folderId);
  }

  async selectFolder(folderId: number, folderName: string) {
    this.searchStore.resetSearch();
    // from cache
    if (this.store.getFolderContents(folderId).length > 0) {
        this.store.setCurrentFolderActive(folderId);
    } else {
        // from API
        const response = await this.getFoldersUseCase.execute(folderId, { page: 1, limit: 10 });
        const { data: folders, hasMore } = response.data;
        
        this.store.setFolderChildren(folderId, folderName, folders, 60000, hasMore);
        if (folders.length > 0) {
            this.store.setCurrentFolderActive(folderId);
        }
    }
  }

  async loadMore() {
    if (!this.isLoadingFiles) {
        // Load folders
        this.currentPage.value++;
        const result = await this.getFoldersUseCase.execute(
            this.store.selectedFolderId, 
            { page: this.currentPage.value, limit: 10 }
        );
        const { data: folders, hasMore } = result.data;
        
        this.store.setFolderChildren(
            this.store.selectedFolderId!, 
            '',
            folders,
            60000,
            hasMore,
            true
        );

        // If no more folders, start loading files
        if (!hasMore) {
            this.isLoadingFiles = true;
            await this.loadInitialFiles(this.store.selectedFolderId!);
        }
    } else {
        // Load more files
        await this.loadMoreFiles();
    }
}

private async loadInitialFiles(folderId: number) {
  try {
      const response = await fetch(
          `http://localhost:3000/api/v1/files?folder_id=${folderId}&page=1&limit=10`
      );
      const data = await response.json();
      
      // Get existing cache entry
      const cacheEntry = this.store.folderCache.get(folderId);
      if (cacheEntry) {
          // Update cache entry with initial files
          this.store.updateCacheFiles(folderId, {
              ...cacheEntry,
              files: data.data.data,
              hasMoreFiles: data.data.hasMore
          });
      }

      // Update file results state
      this.store.resetFiles();
      this.store.setFiles(data.data.data, data.data.hasMore);
  } catch (error) {
      console.error('Error loading initial files:', error);
  }
}

private async loadMoreFiles() {
  try {
      const nextPage = this.store.getCurrentFilePage + 1;
      const folderId = this.store.selectedFolderId!;
      
      const response = await fetch(
          `http://localhost:3000/api/v1/files?folder_id=${folderId}&page=${nextPage}&limit=10`
      );
      const data = await response.json();

      // Get existing cache entry
      const cacheEntry = this.store.folderCache.get(folderId);
      if (cacheEntry) {
          // Append new files to cache
          const updatedFiles = [...(cacheEntry.files || []), ...data.data.data];
          this.store.updateCacheFiles(folderId, {
              ...cacheEntry,
              files: updatedFiles,
              hasMoreFiles: data.data.hasMore
          });
      }

      // Update file results state
      this.store.appendFiles(data.data.data, data.data.hasMore);
  } catch (error) {
      console.error('Error loading more files:', error);
  }
}

  get hasMore(): boolean {
    return this.store.selectedFolderContents?.hasMore || false;
  }

 get folderActive(): FolderEntity[] {
    return toRaw(this.store.selectedFolderContents.data);
  }

  get fileActive(): FileEntity[] {
    return toRaw(this.store.selectedFolderContents.files || []);
  }

  get folderList(): FolderEntity[] {
    return this.store.getFolders;
  }
}
