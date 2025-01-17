import { ref } from "vue";
import { useSearchStore } from "../stores/searchStore";
import { useFolderStore } from "../stores/folderStore";
import { SearchBloc } from "./SearchBloc";

export class PanelRightBloc {
    private searchStore = useSearchStore();
    private folderStore = useFolderStore();

    get folderName() {
        const selectedFolder = this.folderStore.selectedFolderContents;
        return selectedFolder?.name || 'Root Folder';
    }

    get searchResults() {
        return this.searchStore.getSearchResults;
    }

    get isSearchActive() {
        return this.searchResults.length > 0;
    }

    get hasMore() {
        return this.searchStore.getHasMore;
    }

    async loadMore() {
        const nextPage = this.searchStore.getCurrentPage + 1;
        this.searchStore.setCurrentPage(nextPage);
        // Trigger new search with updated page
        const searchBloc = new SearchBloc();
        await searchBloc.search(this.searchStore.getSearchQuery);
    }
}