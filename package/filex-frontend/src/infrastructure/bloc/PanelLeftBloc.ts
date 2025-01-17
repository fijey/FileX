import { FolderModel } from '../../domain/models/FolderModel';
import type { IPanelLeftBloc } from '../../domain/interfaces/IPanelLeftBloc';
import { GetFolderUseCase } from '../../application/use-cases/folder/GetFolderUseCase';
import { useGlobalStore } from '../stores/globalStore';
import { toRaw } from '../../domain/shared/utils/reactivity';
import { useSearchStore } from '../stores/searchStore';
import { ref } from 'vue';
import type { FileModel } from '../../domain/models/FileModel';
import type { LoadFilesUseCase } from '../../application/use-cases/folder/LoadFilesUseCase';
import type { ToggleFolderUseCase } from "../../application/use-cases/folder/ToggleFolderUseCase";

export class PanelLeftBloc implements IPanelLeftBloc {
  private store = useGlobalStore();
  private searchStore = useSearchStore();
  private currentPage = ref(1);
  private isLoadingFiles = false;

  constructor(
    private getFoldersUseCase: GetFolderUseCase,
    private toggleFolderUseCase: ToggleFolderUseCase,
    private loadFilesUseCase: LoadFilesUseCase
  ) {}

  async loadFolders() {
    const result = await this.getFoldersUseCase.execute(null, { page: 1, limit: 10 });
    this.store.setFolders(result.data);
    this.store.setFolderChildren(0, '', result.data, 60000, result.hasMore);
  }

  async toggleFolderExpansion(folderId: number, folderName: string) {
    this.store.toggleFolderExpansion(folderId);

    if (this.isFolderExpanded(folderId)) {
      const result = await this.toggleFolderUseCase.execute(folderId, folderName);
      this.store.setFolderChildren(folderId, folderName, result.data, 60000, result.hasMore);
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
        const { data: folders, hasMore } = response;
        
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
        const { data: folders, hasMore } = result;
        
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

 get folderActive(): FolderModel[] {
    return toRaw(this.store.selectedFolderContents.data);
  }

  get fileActive(): FileModel[] {
    return toRaw(this.store.selectedFolderContents.files || []);
  }

  get folderList(): FolderModel[] {
    return this.store.getFolders;
  }
}
