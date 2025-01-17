import { useFolderStore } from '../../stores/folderStore';
import { ref } from 'vue';
import type { FolderEntity } from '../../domain/entities/FolderEntity';

interface SearchResults {
  folders: FolderEntity[];
  files: any[]; // Add FileEntity type if available
  hasMoreFolders: boolean;
  hasMoreFiles: boolean;
}

export class SearchBloc {
    private store = useFolderStore();
    private page = ref(1);
    private searchResults = ref<SearchResults>({
        folders: [],
        files: [],
        hasMoreFolders: true,
        hasMoreFiles: true
    });
    private isSearching = ref(false);
    
    constructor() {}
    
    get folderName() {
        const selectedFolder = this.store.selectedFolderContents;
        return selectedFolder?.name || 'Root Folder';
    }

    get currentFolderId() {
        return this.store.selectedFolderId;
    }

    async search(query: string) {
        if (!query.trim()) {
            this.resetSearch();
            return;
        }

        this.isSearching.value = true;
        await this.searchFolders(query);
    }

    private async searchFolders(query: string) {
        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/folders?` + 
                new URLSearchParams({
                    query,
                    folderId: this.currentFolderId || 0,
                    page: this.page.value.toString(),
                    type: 'folder'
                })
            );

            const data = await response.json();
            
            if (this.page.value === 1) {
                this.searchResults.value.folders = data.folders;
            } else {
                this.searchResults.value.folders = [
                    ...this.searchResults.value.folders,
                    ...data.folders
                ];
            }

            this.searchResults.value.hasMoreFolders = data.hasMore;
            
            if (!data.hasMore && this.searchResults.value.folders.length === 0) {
                await this.searchFiles(query);
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    private async searchFiles(query: string) {
        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/search?` + 
                new URLSearchParams({
                    query,
                    folderId: this.currentFolderId?.toString() || '0',
                    page: this.page.value.toString(),
                    type: 'file'
                })
            );

            const data = await response.json();
            
            if (this.page.value === 1) {
                this.searchResults.value.files = data.files;
            } else {
                this.searchResults.value.files = [
                    ...this.searchResults.value.files,
                    ...data.files
                ];
            }

            this.searchResults.value.hasMoreFiles = data.hasMore;
        } catch (error) {
            console.error('Search error:', error);
        }
	}

    get isLoading() {
        return this.isSearching;
    }
}