import { defineStore } from 'pinia';
import { FolderEntity } from '../../domain/entities/FolderEntity';
import type { FileEntity } from '../../domain/entities/FileEntity';

interface SearchState {
  page: number;
  filePage: number;
  searchQuery: string;
  results: {
    files: FileEntity[];
    folders: FolderEntity[];
    hasMoreFolders: boolean;
    hasMoreFiles: boolean;
    isSearching: boolean;
  };
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    page: 1,
    filePage: 1,
    searchQuery: '',
    results: {
      folders: [],
      files: [],
      hasMoreFiles: true,
      hasMoreFolders: true,
      isSearching: false
    }
  }),

  actions: {
    setSearchResults(folders: FolderEntity[], hasMore: boolean) {
      if (this.page === 1) {
        this.results.folders = folders;
      } else {
        this.results.folders = [...this.results.folders, ...folders];
      }
      this.results.hasMoreFolders = hasMore;
    },

    setFileResults(files: FileEntity[], hasMore: boolean) {
      if (this.filePage === 1) {
        this.results.files = files;
      } else {
        this.results.files = [...this.results.files, ...files];
      }
      this.results.hasMoreFiles = hasMore;
    },

    setSearching(value: boolean) {
      this.results.isSearching = value;
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    setCurrentPage(page: number) {
      this.page = page;
    },

    setCurrentFilePage(page: number) {
      this.filePage = page;
    },

    resetSearch() {
      this.page = 1;
      this.filePage = 1;
      this.searchQuery = '';
      this.results = {
        folders: [],
        files: [],
        hasMoreFiles: true,
        hasMoreFolders: true,
        isSearching: false
      };
    }
  },

  getters: {
    getSearchResults: (state) => state.results.folders,
    getHasMore: (state) => state.results.hasMoreFolders,
    getIsSearching: (state) => state.results.isSearching,
    getCurrentPage: (state) => state.page,
    getSearchQuery: (state) => state.searchQuery,
    getCurrentFilePage: (state) => state.filePage,
    getFileResults: (state) => state.results.files,
    getHasMoreFiles: (state) => state.results.hasMoreFiles,
    getHasMoreFolders: (state) => state.results.hasMoreFolders
  }
});

