import { ref } from "vue";
import { useSearchStore } from "../../stores/searchStore";
import { useFolderStore } from "../../stores/folderStore";

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
}