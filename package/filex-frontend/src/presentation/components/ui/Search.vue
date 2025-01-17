<template>
    <div>
        <div class="flex gap-2 relative">
            <input 
                v-model="searchQuery"
                type="text"
                :placeholder="`Cari di ${folderName}`"
                class="flex-1 bg-white/5 px-4 py-2 rounded-lg outline-none focus:ring-2 ring-white/20 transition-all"
            />
            <button 
                @click="handleSearch"
                class="bg-white/5 px-6 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
                Search
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { SearchBloc } from '../../bloc/SearchBloc';
import { Folder, File } from 'lucide-vue-next';

export default defineComponent({
    name: 'Search',
    components: {
        Folder,
        File
    },
    setup() {
        const searchBloc = new SearchBloc();
        const searchQuery = ref('');

        const handleSearch = () => {
            if (searchQuery.value.trim()) {
                searchBloc.resetSearch();
                searchBloc.search(searchQuery.value);
            }
        };

        return {
            searchBloc,
            searchQuery,
            folderName: computed(() => searchBloc.folderName),
            handleSearch
        };
    }
});
</script>

<style scoped>
.glass-morphism {
    backdrop-filter: blur(10px);
    border: 1px solid theme('colors.white/10');
    max-height: 400px;
    overflow-y: auto;
}
</style>