import { ref, type Ref } from 'vue';
import { FolderEntity } from '../../domain/entities/FolderEntity';
import { GetFolderUseCase } from '../../domain/use-cases/folder/GetFolderUseCase';
import { useFolderStore } from '../../stores/folderStore';

export class FolderBloc {
  private store = useFolderStore();

  constructor(private getFoldersUseCase: GetFolderUseCase) {}

  async loadFolders() {
    const result = await this.getFoldersUseCase.execute(null);
    this.store.setFolders(result);
  }

  async toggleFolder(folderId: number) {
    this.store.toggleFolder(folderId);

    if (this.isFolderOpen(folderId)) {
      const children = await this.getFoldersUseCase.execute(folderId);
      this.store.setFolderChildren(folderId, children);
    }
  }

  isFolderOpen(folderId: number): boolean {
    return this.store.isOpen[folderId] || false;
  }

  get folderList(): FolderEntity[] {
    return this.store.getFolders;
  }
}
