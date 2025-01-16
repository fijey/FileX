<template class="group">
	<h2 class="text-lg font-semibold mb-4">Current Folder Active</h2>

</template>

<script lang="ts">
import { Folder, ChevronUp, ChevronDown } from 'lucide-vue-next';
import { defineComponent, ref, onMounted, computed, provide } from 'vue';
import { FolderBloc } from '../bloc/FolderBloc';
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

		return {
            Folder
		};
	},
})

</script>