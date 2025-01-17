import { FolderEntity } from '../../domain/entities/FolderEntity';
import type { IFolderBloc } from '../../domain/interfaces/IFolderBloc';
import { GetFolderUseCase } from '../../domain/use-cases/folder/GetFolderUseCase';
import { useFolderStore } from '../../stores/folderStore';
import { toRaw } from '../../domain/utils/reactivity';
import { useSearchStore } from '../../stores/searchStore';
import { ref } from 'vue';

export class FolderBloc implements IFolderBloc {
  private store = useFolderStore();
  private searchStore = useSearchStore();
  private currentPage = ref(1);

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
    // this.searchStore.resetSearch();
    if (this.store.getFolderContents(folderId).length > 0) {
        this.store.setCurrentFolderActive(folderId);
    } else {
        const response = await this.getFoldersUseCase.execute(folderId, { page: 1, limit: 10 });
        // Get the folders array and hasMore from the response
        const { data: folders, hasMore } = response.data;
        
        // Pass both folders and hasMore to store
        this.store.setFolderChildren(folderId, folderName, folders, 60000, hasMore);
        if (folders.length > 0) {
            this.store.setCurrentFolderActive(folderId);
        }
    }
  }

  async loadMore() {
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
      true // Add shouldAppend = true here
    );
  }

  get hasMore(): boolean {
    return this.store.selectedFolderContents?.hasMore || false;
  }

 get folderActive(): FolderEntity[] {
    return toRaw(this.store.selectedFolderContents.data);
  }

  get folderList(): FolderEntity[] {
    return this.store.getFolders;
  }
}
