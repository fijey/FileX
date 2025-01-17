<template class="group">
    <h2 class="text-lg font-semibold mb-4">
        {{ isSearchActive ? `Search Results in ${folderName}` : folderName }}
    </h2>

    <div class="grid grid-cols-3 gap-4">
        <div v-for="folder in displayedFolders" 
            :key="folder.id" 
            class="flex flex-col items-center p-4 rounded-lg hover:bg-white/20 cursor-pointer">
            <div class="icon mb-2">
                <Folder color="white" fill="white" :size="40" />
            </div>
            <div class="folder-name">
                {{ folder.name }}
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
import { Folder, ChevronUp, ChevronDown } from 'lucide-vue-next';
import { defineComponent, computed } from 'vue';
import { FolderBloc } from '../bloc/FolderBloc';
import { PanelRightBloc } from '../bloc/PanelRightBloc';
import { GetFolderUseCase } from '../../domain/use-cases/folder/GetFolderUseCase';
import { FolderRepository } from '../../data/repository/FolderRepository';

export default defineComponent({
	name: 'PanelRight',
	components: {
		Folder,
		ChevronUp,
		ChevronDown
	},
	setup() {
		const folderbloc = new FolderBloc(new GetFolderUseCase(new FolderRepository()));
		const panelRightBloc = new PanelRightBloc();
		
		const isSearchActive = computed(() => panelRightBloc.isSearchActive);
		const displayedFolders = computed(() => 
			isSearchActive.value ? panelRightBloc.searchResults : folderbloc.folderActive
		);
		const folderName = computed(() => panelRightBloc.folderName);
		const showMoreButton = computed(() => 
			(isSearchActive.value && panelRightBloc.hasMore) || 
			(!isSearchActive.value && folderbloc.hasMore)
		);

		const handleLoadMore = async () => {
			if (isSearchActive.value) {
				await panelRightBloc.loadMore();
			} else {
				await folderbloc.loadMore();
			}
		};

		return {
			displayedFolders,
			isSearchActive,
			folderName,
			showMoreButton,
			handleLoadMore
		};
	},
})

</script>