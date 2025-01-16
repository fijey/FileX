<template>
	 <h2 class="text-lg font-semibold mb-4">Folders</h2>
	<div id="folder-sidebar" class="rounded-lg p-4 flex items-center hover:bg-white/20 cursor-pointer group"
		v-for="folder in folders" :key="folder.id">
		<div class="icon">
			<Folder color="white" fill="white" size="25"/>
		</div>
		<div class="title ml-2">
			{{ folder.name }}
		</div>
		<div class="ml-auto invisible group-hover:visible">
			<ChevronUp color="white" fill="white" size="25"/>
		</div>
	</div>
</template>

<script lang="ts">
import { Folder, ChevronUp, ChevronDown } from 'lucide-vue-next';
import { defineComponent, ref, onMounted, computed } from 'vue';
import { FolderBloc } from '../bloc/FolderBloc';
import { GetFolderUseCase } from '../../domain/use-cases/folder/GetFolderUseCase';
import { FolderRepository } from '../../data/repository/FolderRepository';

export default defineComponent({
	name: 'PanelLeft',
	components: {
		Folder,
		ChevronUp,
		ChevronDown
	},
	setup() {
		const folderBloc = new FolderBloc(new GetFolderUseCase(new FolderRepository()));
		const folders = computed(() => folderBloc.folderList);

		onMounted(async () => {
			const data = await folderBloc.loadFolders();
		});

		return {
			folders
		};
	},
})

</script>