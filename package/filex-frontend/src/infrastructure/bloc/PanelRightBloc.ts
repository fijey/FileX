import { ref } from "vue";
import { useSearchStore } from "../stores/searchStore";
import { useGlobalStore } from "../stores/globalStore";
import { SearchBloc } from "./SearchBloc";

export class PanelRightBloc {
    private searchStore = useSearchStore();
    private globalStore = useGlobalStore();

    get folderName() {
        const selectedFolder = this.globalStore.selectedFolderContents;
        return selectedFolder?.name || 'Root Folder';
    }

    get searchResults() {
        return this.searchStore.getSearchResults;
    }

    get searchResultFiles() {
        return this.searchStore.getFileResults;
    }

    get isSearchActive() {
        return this.searchResults.length > 0 || this.searchResultFiles.length > 0;
    }

    get hasMore() {
        // If still has folders, show folder pagination
        if (this.searchStore.getHasMoreFolders) {
            return true;
        }
        // If no more folders but has files, show file pagination
        return this.searchStore.getHasMoreFiles;
    }

    async loadMore() {
        if (this.searchStore.getHasMoreFolders) {
            // Load more folders
            const nextPage = this.searchStore.getCurrentPage + 1;
            this.searchStore.setCurrentPage(nextPage);
        } else {
            // Load more files
            const nextFilePage = this.searchStore.getCurrentFilePage + 1;
            this.searchStore.setCurrentFilePage(nextFilePage);
        }
        
        // Trigger new search with updated page
        const searchBloc = new SearchBloc();
        await searchBloc.search(this.searchStore.getSearchQuery);
    }
}