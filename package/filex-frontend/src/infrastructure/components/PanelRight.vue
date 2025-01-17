<template class="group">
    <h2 class="text-lg font-semibold mb-4">
        {{ isSearchActive ? `Search Results in ${folderName}` : folderName }}
    </h2>

    <div 
        class="grid grid-cols-3 gap-4" 
        ref="containerRef"
        @scroll="handleScroll"
        style="max-height: calc(100vh - 200px); overflow-y: auto;"
    >
        <div v-for="item in [...displayedFolders, ...displayedFiles]" 
            :key="item.id" 
            class="flex flex-col items-center p-4 rounded-lg hover:bg-white/20 cursor-pointer"
            @click="handleItemClick(item)">
            
            <div class="icon mb-2">
                <Folder v-if="'parent_id' in item" color="white" fill="white" :size="40" />
                <File v-else color="grey" fill="grey" :size="40" />
            </div>
            <div>
                {{ item.name }}
            </div>
        </div>
    </div>
    <Loading :show="isLoading" />
</template>

<script lang="ts">
import { Folder, ChevronUp, ChevronDown, File } from 'lucide-vue-next';
import { defineComponent, computed, ref, onMounted, onUnmounted } from 'vue';
import { PanelLeftBloc } from '../bloc/PanelLeftBloc';
import { PanelRightBloc } from '../bloc/PanelRightBloc';
import { GetFolderUseCase } from '../../application/use-cases/folder/GetFolderUseCase';
import { FolderRepository } from '../../application/repository/FolderRepository';
import type { FolderModel } from '../../domain/models/FolderModel';
import type { FileModel } from '../../domain/models/FileModel';
import { CacheService } from '../../application/services/CacheService';
import { FileRepository } from '../../application/repository/FileRepository';
import { ToggleFolderUseCase } from '../../application/use-cases/folder/ToggleFolderUseCase';
import { LoadFilesUseCase } from '../../application/use-cases/folder/LoadFilesUseCase';
import Loading from './ui/Loading.vue';

export default defineComponent({
    name: 'PanelRight',
    components: {
        Folder,
        ChevronUp,
        ChevronDown,
        File,
        Loading
    },
    setup() {
        const cacheService = new CacheService();
		const fileRepository = new FileRepository();
		const folderRepository = new FolderRepository();
		const getFoldersUseCase = new GetFolderUseCase(folderRepository);
		const toggleFolderUseCase = new ToggleFolderUseCase(folderRepository, cacheService);
		const loadFilesUseCase = new LoadFilesUseCase(fileRepository, cacheService);

        const panelLeft = new PanelLeftBloc(
			getFoldersUseCase,
			toggleFolderUseCase,
			loadFilesUseCase
		);
        const panelRightBloc = new PanelRightBloc();
        const containerRef = ref<HTMLElement | null>(null);
        const isLoading = ref(false);
        
        const isSearchActive = computed(() => panelRightBloc.isSearchActive);
        const displayedFolders = computed(() => 
            isSearchActive.value ? panelRightBloc.searchResults : panelLeft.folderActive
        );

        const displayedFiles = computed(() => 
            isSearchActive.value ? panelRightBloc.searchResultFiles : panelLeft.fileActive
        );
        
        const folderName = computed(() => panelRightBloc.folderName);
        const showMoreButton = computed(() => 
            (isSearchActive.value && panelRightBloc.hasMore) || 
            (!isSearchActive.value && panelLeft.hasMore)
        );

        const handleScroll = async (event: Event) => {
            if (!showMoreButton.value || isLoading.value) return;

            const target = event.target as HTMLElement;
            const { scrollTop, scrollHeight, clientHeight } = target;
            const threshold = 50; // pixels from bottom

            if (scrollHeight - (scrollTop + clientHeight) < threshold) {
                isLoading.value = true;
                try {
                    if (isSearchActive.value) {
                        await panelRightBloc.loadMore();
                    } else {
                        await panelLeft.loadMore();
                    }
                } finally {
                    isLoading.value = false;
                }
            }
        };

        const handleItemClick = (item: FolderModel | FileModel) => {
            if ('parent_id' in item) {
                panelLeft.selectFolder(item.id, item.name);
            }
        };

        return {
            containerRef,
            displayedFolders,
            displayedFiles,
            isSearchActive,
            folderName,
            showMoreButton,
            handleScroll,
            handleItemClick,
            isLoading
        };
    },
})
</script>

<style scoped>
.grid {
    scroll-behavior: smooth;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.grid::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.grid {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>