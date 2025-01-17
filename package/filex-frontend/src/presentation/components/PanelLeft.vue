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
import { FolderBloc } from '../bloc/FolderBloc';
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
		const folderBloc = new FolderBloc(new GetFolderUseCase(new FolderRepository()));
		const folders = computed(() => folderBloc.folderList);

		provide('folderBloc', folderBloc);

		onMounted(async () => {
			await folderBloc.loadFolders();
		});

		return {
			folders,
			ChevronUp,
			ChevronDown
		};
	},
})

</script>