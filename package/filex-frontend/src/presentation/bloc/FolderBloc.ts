import { ref, type Ref } from 'vue';
import { FolderEntity } from '../../domain/entities/FolderEntity';
import { GetFolderUseCase } from '../../domain/use-cases/folder/GetFolderUseCase';

export class FolderBloc {
  private folders: Ref<FolderEntity[]>;

  constructor(private getFoldersUseCase: GetFolderUseCase) {
    this.folders = ref([]);
  }

  async loadFolders() {
    const result = await this.getFoldersUseCase.execute();
    this.folders.value = result;
  }

  get folderList(): FolderEntity[] {
    return this.folders.value;
  }
}
