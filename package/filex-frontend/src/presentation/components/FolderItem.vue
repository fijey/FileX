<template>
  <div :style="`margin-left: ${depth * 1}rem`">
		<div class="rounded-lg p-4 flex items-center hover:bg-white/20 cursor-pointer select-none">
		<div class="icon">
			<Folder color="white" fill="white" :size="25" />
		</div>
		<div class="title ml-2">
			{{ folder.name }}
		</div>
		<div v-if="folder.hasChildren" class="ml-auto chevron-icon transition-opacity"
			@click.stop="toggleFolder(folder.id)">
			<component :is="isFolderOpen(folder.id) ? ChevronUp : ChevronDown" 
			color="white" 
			fill="white"
			:size="25" 
			/>
		</div>
		</div>
	</div>
	<FolderItem
		v-if="isFolderOpen(folder.id)"
		v-for="child in folder.children"
		:key="child.id"
		:folder="child"
		:depth="depth + 1"
	/>
</template>


	<script lang="ts">
import { Folder, ChevronUp, ChevronDown } from 'lucide-vue-next';
import { inject, defineComponent, type PropType } from 'vue';
import { FolderEntity } from '../../domain/entities/FolderEntity';
import type { FolderBloc } from '../bloc/FolderBloc';

export default defineComponent({
	name: 'FolderItem',
	components: {
		Folder,
		ChevronUp,
		ChevronDown
	},
	props: {
		folder: {
			type: Object as PropType<FolderEntity>,
			required: true
		},
		depth: {
			type: Number,
			default: 0
		}
	},
	setup(props) {
		const folderBloc = inject('folderBloc') as FolderBloc;

		return {
			toggleFolder: (folderId: number) => folderBloc.toggleFolder(folderId),
			isFolderOpen: (folderId: number) => folderBloc.isFolderOpen(folderId),
			ChevronUp,
			ChevronDown
		};
	},
})

</script>
