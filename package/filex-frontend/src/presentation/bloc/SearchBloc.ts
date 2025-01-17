import { useFolderStore } from '../../stores/folderStore';
import { toRaw } from 'vue';

export class SearchBloc {
    private folderStore = useFolderStore();
    
    constructor(){}
    
    get folderName() {
        const selectedFolder = this.folderStore?.selectedFolderContents;
        return selectedFolder?.name || 'Root Folder';
    }
}