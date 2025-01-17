import { defineStore } from 'pinia';
import type { FolderEntity } from '../domain/entities/FolderEntity';

interface SearchState {
  page: number;
  searchQuery: string;
  results: {
    folders: FolderEntity[];
    hasMoreFolders: boolean;
    isSearching: boolean;
  };
}

export const useSearchStore = defineStore('search', {
  state: (): SearchState => ({
    page: 1,
    searchQuery: '',
    results: {
      folders: [],
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

    setSearching(value: boolean) {
      this.results.isSearching = value;
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    resetSearch() {
      this.page = 1;
      this.searchQuery = '';
      this.results = {
        folders: [],
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
    getSearchQuery: (state) => state.searchQuery
  }
});

