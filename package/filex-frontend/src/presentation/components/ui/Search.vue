<template>
	<div>
		<div class="flex gap-2">
			<input 
				type="text"
				:placeholder="`Cari di ${folderName}`"
				class="flex-1 bg-white/5 px-4 py-2 rounded-lg outline-none focus:ring-2 ring-white/20 transition-all"
			/>
			<button 
				class="bg-white/5 px-6 py-2 rounded-lg hover:bg-white/10 transition-all flex items-center gap-2">
				Search
			</button>
			</div>
	</div>
</template>
<script lang="ts">
	import { defineComponent, computed } from 'vue';
	import { SearchBloc } from '../../bloc/SearchBloc';
	export default defineComponent({
		name: 'Search',
		setup() {
			const searchBloc = new SearchBloc();
			const folderName = computed(() => searchBloc.folderName);
			return {
				folderName
			};
		}
	})
</script>
<style lang="">
	
</style>