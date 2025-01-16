import { defineStore } from 'pinia'
import { FolderEntity } from '../domain/entities/FolderEntity'

export const useFolderStore = defineStore('folder', {
  state: () => ({
    folders: [] as FolderEntity[],
    isOpen: {} as Record<string, boolean>
  }),
  actions: {
    setFolders(folders: FolderEntity[]) {
      this.folders = folders
    },
    toggleFolder(folderId: number) {
      this.isOpen[folderId] = !this.isOpen[folderId]
    },
    setFolderChildren(folderId: number, children: FolderEntity[]) {
      const updateFoldersRecursively = (folders: FolderEntity[]): FolderEntity[] => {
        return folders.map(folder => {
          if (folder.id === folderId) {
            return { ...folder, children };
          }
          if (folder.children?.length) {
            return { 
              ...folder, 
              children: updateFoldersRecursively(folder.children) 
            };
          }
          return folder;
        });
      };
      
      this.folders = updateFoldersRecursively(this.folders);
    }
  },
  getters: {
    getFolders: (state) => state.folders
  }
})