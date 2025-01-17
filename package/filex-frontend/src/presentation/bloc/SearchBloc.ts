import { useGlobalStore } from '../stores/globalStore';
import { useSearchStore } from '../stores/searchStore';

export class SearchBloc {
    private globalStore = useGlobalStore();
    private searchStore = useSearchStore();
    
    get folderName() {
        const selectedFolder = this.globalStore.selectedFolderContents;
        return selectedFolder?.name || 'Root Folder';
    }

    get currentFolderId() {
        return this.globalStore.selectedFolderId;
    }

    async search(query: string) {
        if (!query.trim()) {
            this.searchStore.resetSearch();
            return;
        }

        this.searchStore.setSearching(true);
        this.searchStore.setSearchQuery(query);
        await this.searchFolders(query);
    }

    private async searchFolders(query: string) {
        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/folders?` + 
                new URLSearchParams({
                    search: query,
                    parent_id: this.currentFolderId?.toString() || '',
                    page: this.searchStore.getCurrentPage.toString(),
                    limit: '10'
                })
            );

            const responseData = await response.json();
            this.searchStore.setSearchResults(responseData.data.data, responseData.data.hasMore);
            
            // If no more folders, start searching files
            if (!responseData.data.hasMore && responseData.data.data.length === 0) {
                await this.searchFiles(query);
            }
            
            this.searchStore.setSearching(false);
        } catch (error) {
            console.error('Search error:', error);
            this.searchStore.setSearching(false);
        }
    }

    private async searchFiles(query: string) {
        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/files?` + 
                new URLSearchParams({
                    search: query,
                    folder_id: this.currentFolderId?.toString() || '',
                    page: this.searchStore.getCurrentFilePage.toString(),
                    limit: '10'
                })
            );

            const responseData = await response.json();
            this.searchStore.setFileResults(responseData.data.data, responseData.data.hasMore);
        } catch (error) {
            console.error('File search error:', error);
        }
    }

    async loadMore() {
        if (this.searchStore.getHasMoreFolders) {
            this.searchStore.setCurrentPage(this.searchStore.getCurrentPage + 1);
            await this.searchFolders(this.searchQuery);
        } else {
            this.searchStore.setCurrentFilePage(this.searchStore.getCurrentFilePage + 1);
            await this.searchFiles(this.searchQuery);
        }
    }

    get isLoading() {
        return this.searchStore.getIsSearching;
    }

    get searchResults() {
        return this.searchStore.getSearchResults;
    }

    get hasMoreResults() {
        return this.searchStore.getHasMore;
    }

    get searchQuery() {
        return this.searchStore.getSearchQuery;
    }

    resetSearch() {
        this.searchStore.resetSearch();
    }

    get fileResults() {
        return this.searchStore.getFileResults;
    }

    get hasMoreFiles() {
        return this.searchStore.getHasMoreFiles;
    }
}