<template>
  <div class="min-h-screen bg-black/80 text-white">
    
    <main class="container mx-auto p-2">
      <div class="grid grid-cols-12 gap-4">
        <div class="col-span-3 glass-morphism p-4 rounded-lg">
         <PanelLeft/>
        </div>
        
        <div class="col-span-9 glass-morphism p-4 rounded-lg">
          <PanelRight/>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Folder } from 'lucide-vue-next'
import PanelLeft from '@/presentation/components/PanelLeft.vue'
import PanelRight from '@/presentation/components/PanelRight.vue'

const currentFolder = ref(null)
</script>

<style scoped>
.glass-morphism {
  background: theme('colors.primary');
  backdrop-filter: blur(10px);
  border: 1px solid theme('colors.black');
  position: relative;
  overflow: hidden;
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