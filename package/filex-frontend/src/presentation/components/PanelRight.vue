<template class="group">
    <h2 class="text-lg font-semibold mb-4">
        {{ isSearchActive ? `Search Results in ${folderName}` : folderName }}
    </h2>

    <div class="grid grid-cols-3 gap-4">
        <div v-for="item in [...displayedFolders, ...displayedFiles]" 
            :key="item.id" 
            class="flex flex-col items-center p-4 rounded-lg hover:bg-white/20 cursor-pointer">
            <div class="icon mb-2">
                <Folder v-if="'parent_id' in item" color="white" fill="white" :size="40" />
                <File v-else color="blue" fill="blue" :size="40" />
            </div>
            <div>
                {{ item.name }}
            </div>
        </div>
    </div>

    <!-- Show More Button -->
    <div v-if="showMoreButton" class="mt-4 flex justify-center">
        <button 
            @click="handleLoadMore"
            class="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white">
            Show More
        </button>
    </div>
</template>

<script lang="ts">
import { Folder, ChevronUp, ChevronDown, File } from 'lucide-vue-next';
import { defineComponent, computed } from 'vue';
import { PanelLeftBloc } from '../bloc/PanelLeftBloc';
import { PanelRightBloc } from '../bloc/PanelRightBloc';
import { GetFolderUseCase } from '../../domain/use-cases/folder/GetFolderUseCase';
import { FolderRepository } from '../../data/repository/FolderRepository';

export default defineComponent({
	name: 'PanelRight',
	components: {
		Folder,
		ChevronUp,
		ChevronDown,
		File
	},
	setup() {
		const panelLeft = new PanelLeftBloc(new GetFolderUseCase(new FolderRepository()));
		const panelRightBloc = new PanelRightBloc();
		
		const isSearchActive = computed(() => panelRightBloc.isSearchActive);
		const displayedFolders = computed(() => 
			isSearchActive.value ? panelRightBloc.searchResults : panelLeft.folderActive
		);

		const displayedFiles = computed(() => 
			isSearchActive.value ? panelRightBloc.searchResults : panelLeft.fileActive
		);
		const folderName = computed(() => panelRightBloc.folderName);
		const showMoreButton = computed(() => 
			(isSearchActive.value && panelRightBloc.hasMore) || 
			(!isSearchActive.value && panelLeft.hasMore)
		);

		const handleLoadMore = async () => {
			if (isSearchActive.value) {
				await panelRightBloc.loadMore();
			} else {
				await panelLeft.loadMore();
			}
		};

		return {
			displayedFolders,
			displayedFiles,
			isSearchActive,
			folderName,
			showMoreButton,
			handleLoadMore
		};
	},
})

</script>