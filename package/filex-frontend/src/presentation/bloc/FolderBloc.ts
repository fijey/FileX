import { FolderEntity } from '../../domain/entities/FolderEntity';
import type { IFolderBloc } from '../../domain/interfaces/IFolderBloc';
import { GetFolderUseCase } from '../../domain/use-cases/folder/GetFolderUseCase';
import { useFolderStore } from '../../stores/folderStore';
import { toRaw } from '../../domain/utils/reactivity';

export class FolderBloc implements IFolderBloc {
  private store = useFolderStore();

  constructor(private getFoldersUseCase: GetFolderUseCase) {}

  async loadFolders() {
    const result = await this.getFoldersUseCase.execute(null);
    this.store.setFolders(result);
    this.store.setFolderChildren(0, result);
  }

  async toggleFolderExpansion(folderId: number) {
    this.store.toggleFolderExpansion(folderId);

    if (this.isFolderExpanded(folderId)) {
      const cachedData = this.store.fetchFolderChildren(folderId);
      if (cachedData.length > 0) {
        this.store.setFolderChildren(folderId, cachedData);
      } else {
        const children = await this.getFoldersUseCase.execute(folderId);
        this.store.setFolderChildren(folderId, children, 60000);
      }
    }
  }

  isFolderExpanded(folderId: number): boolean {
    return this.store.isFolderExpanded(folderId);
  }

  async selectFolder(folderId: number) {
    if (this.store.getFolderContents(folderId).length > 0) {
      console.log('From Cache', this.store.getFolderContents(folderId));
      this.store.setCurrentFolderActive(folderId);
    } else {
      console.log('From API', folderId);
      const folder = await this.getFoldersUseCase.execute(folderId);
      this.store.setFolderChildren(folderId, folder, 60000);
      if (folder.length > 0) {
        this.store.setCurrentFolderActive(folderId);
      }
    }
  }

 get folderActive(): FolderEntity[] {
    return toRaw(this.store.selectedFolderContents);
  }

  get folderList(): FolderEntity[] {
    return this.store.getFolders;
  }
}
