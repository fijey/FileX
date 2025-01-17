<template class="group">
	<h2 class="text-lg font-semibold mb-4">Folders</h2>
	<FolderItem
		v-for="folder in folders"
		:key="folder.id"
		:folder="folder"
		:depth="0"
	 />
</template>

<script lang="ts">
import { Folder, ChevronUp, ChevronDown } from 'lucide-vue-next';
import { defineComponent, ref, onMounted, computed, provide } from 'vue';
import { PanelLeftBloc } from '../bloc/PanelLeftBloc';
import { GetFolderUseCase } from '../../application/use-cases/folder/GetFolderUseCase';
import { FolderRepository } from '../../application/repository/FolderRepository';
import { FileRepository } from '../../application/repository/FileRepository';
import { CacheService } from '../../application/services/CacheService';
import { ToggleFolderUseCase } from '../../application/use-cases/folder/ToggleFolderUseCase';
import { LoadFilesUseCase } from '../../application/use-cases/folder/LoadFilesUseCase';
import FolderItem from './FolderItem.vue';

export default defineComponent({
	name: 'PanelLeft',
	components: {
		Folder,
		ChevronUp,
		ChevronDown,
		FolderItem
	},
	setup() {
		// Initialize dependencies
		const cacheService = new CacheService();
		const fileRepository = new FileRepository();
		const folderRepository = new FolderRepository();
		const getFoldersUseCase = new GetFolderUseCase(folderRepository);
		const toggleFolderUseCase = new ToggleFolderUseCase(folderRepository, cacheService);
		const loadFilesUseCase = new LoadFilesUseCase(fileRepository, cacheService);

		// Create bloc instance
		const panelLeftBloc = new PanelLeftBloc(
			getFoldersUseCase,
			toggleFolderUseCase,
			loadFilesUseCase
		);
		const folders = computed(() => panelLeftBloc.folderList);

		provide('panelLeftBloc', panelLeftBloc);

		onMounted(async () => {
			await panelLeftBloc.loadFolders();
		});

		return {
			folders,
			ChevronUp,
			ChevronDown
		};
	},
})

</script>