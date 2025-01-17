<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div class="flex gap-1">
            <div class="w-5 h-5 bg-white rounded-full animate-bounce" style="animation-delay: 0s"></div>
            <div class="w-5 h-5 bg-white rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-5 h-5 bg-white rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Loading',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    }
})
</script>