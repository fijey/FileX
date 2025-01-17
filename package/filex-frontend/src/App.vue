<template>
  <div class="min-h-screen bg-black/80 text-white">
    <header class="container mx-auto p-2">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3 glass-morphism p-4 rounded-lg flex items-center justify-center">
          <h2 class="text-xl font-bold">File-X Eksplorer</h2>
        </div>
        
        <div class="col-span-9 glass-morphism p-4 rounded-lg">
          <Search />
        </div>
      </div>
    </header>
    <main class="container mx-auto p-2">
      <div class="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
        <div class="col-span-3 glass-morphism p-4 rounded-lg overflow-y-auto">
         <PanelLeft/>
        </div>
        
        <div class="col-span-9 glass-morphism p-4 rounded-lg overflow-y-auto">
          <PanelRight/>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import PanelLeft from './infrastructure/components/PanelLeft.vue'
import PanelRight from './infrastructure/components/PanelRight.vue'
import Search from './infrastructure/components/ui/Search.vue'
</script>

<style scoped>
.glass-morphism {
  background: theme('colors.primary');
  backdrop-filter: blur(10px);
  border: 1px solid theme('colors.white/10');
  position: relative;
  overflow: auto;
}

.glass-morphism::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.24),
    transparent
  );
  /* animation: shine 10s infinite; */
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}
</style>