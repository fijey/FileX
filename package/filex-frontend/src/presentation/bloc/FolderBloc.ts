import { ref, type Ref } from 'vue';
import { FolderEntity } from '../../domain/entities/FolderEntity';
import { GetFolderUseCase } from '../../domain/use-cases/folder/GetFolderUseCase';
import { useFolderStore } from '../../stores/folderStore';

export class FolderBloc {
  private store = useFolderStore();

  constructor(private getFoldersUseCase: GetFolderUseCase) {}

  async loadFolders() {
    const result = await this.getFoldersUseCase.execute();
    this.store.setFolders(result);
  }

  toggleFolder(folderId: string) {
    this.store.toggleFolder(folderId);
  }

  isFolderOpen(folderId: string): boolean {
    return this.store.isOpen[folderId] || false;
  }

  get folderList(): FolderEntity[] {
    return this.store.getFolders;
  }
}
