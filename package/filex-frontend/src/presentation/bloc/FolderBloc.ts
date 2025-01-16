import { FolderEntity } from '../../domain/entities/FolderEntity';
import type { IFolderBloc } from '../../domain/interfaces/IFolderBloc';
import { GetFolderUseCase } from '../../domain/use-cases/folder/GetFolderUseCase';
import { useFolderStore } from '../../stores/folderStore';

export class FolderBloc implements IFolderBloc {
  private store = useFolderStore();

  constructor(private getFoldersUseCase: GetFolderUseCase) {}

  async loadFolders() {
    const result = await this.getFoldersUseCase.execute(null);
    this.store.setFolders(result);
    this.store.setFolderChildren(0, result);
  }

  async toggleFolder(folderId: number) {
    this.store.toggleFolder(folderId);

    if (this.isFolderOpen(folderId)) {
      const cachedData = this.store.fetchFolderChildren(folderId);
      if (cachedData.length > 0) {
        this.store.setFolderChildren(folderId, cachedData);
      } else {
        const children = await this.getFoldersUseCase.execute(folderId);
        this.store.setFolderChildren(folderId, children, 60000);
      }
    }
  }

  isFolderOpen(folderId: number): boolean {
    return this.store.isFolderOpen(folderId);
  }

  get folderList(): FolderEntity[] {
    return this.store.getFolders;
  }
}
