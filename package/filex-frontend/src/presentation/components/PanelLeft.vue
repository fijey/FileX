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
import { GetFolderUseCase } from '../../domain/use-cases/folder/GetFolderUseCase';
import { FolderRepository } from '../../data/repository/FolderRepository';
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
		const panelLeftBloc = new PanelLeftBloc(new GetFolderUseCase(new FolderRepository()));
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