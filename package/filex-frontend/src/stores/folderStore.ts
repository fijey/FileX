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
    toggleFolder(folderId: string) {
      this.isOpen[folderId] = !this.isOpen[folderId]
    }

  },
  getters: {
    getFolders: (state) => state.folders
  }
})