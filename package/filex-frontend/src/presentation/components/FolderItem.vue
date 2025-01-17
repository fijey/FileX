<template>
<div :style="`margin-left: ${depth * 1}rem`">
	<div class="rounded-lg p-4 flex items-center hover:bg-white/20 cursor-pointer select-none">
		<div class="w-[25px] mr-2">
			<div 
				v-show="folder.hasChildren" 
				class="chevron-icon transition-opacity" 
				@click.stop="toggleFolderExpansion(folder.id, folder.name)">
					<component
						:is="isFolderExpanded(folder.id) ? ChevronUp : ChevronDown" 
						color="white" 
						fill="white"
						:size="25" 
					/>
			</div>
		</div>
		<div class="flex items-center" @click="selectFolder(folder.id, folder.name)">
			<div class="icon">
				<Folder color="white" fill="white" :size="25" />
			</div>
			<div class="title ml-2">
				{{ folder.name }}
			</div>
		</div>
	</div>
</div>
<FolderItem
	v-if="isFolderExpanded(folder.id)"
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
import type { PanelLeftBloc } from '../bloc/PanelLeftBloc';

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
		const panelLeftBloc = inject('panelLeftBloc') as PanelLeftBloc;

		return {
			selectFolder: (folderId: number, folderName: string) => panelLeftBloc.selectFolder(folderId, folderName),
			toggleFolderExpansion: (folderId: number, folderName: string) => panelLeftBloc.toggleFolderExpansion(folderId, folderName),
			isFolderExpanded: (folderId: number) => panelLeftBloc.isFolderExpanded(folderId),
			ChevronUp,
			ChevronDown
		};
	},
})

</script>
