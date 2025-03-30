<script setup>
import { defineAsyncComponent } from 'vue'
import { useHead } from '@unhead/vue'
import { pageMeta } from './meta'

useHead({
  title: 'Color correction - skorikovkr',
  meta: pageMeta,
})

const ColorCorrectionWorkView = defineAsyncComponent(() => import('./ColorCorrectionWorkView.vue'))
</script>

<template>
  <div class="color-correction">
    <h1 class="text-3xl font-semibold mb-4">Color correction app</h1>
    <p>This is web application for color correction.</p>
    <p>Create and move <i>dots</i> to change image's colors.</p>
    <p class="mb-4">Use <i>mouse scroll</i> to zoom image and <i>left mouse button</i> to move.</p>
    <ClientOnly>
      <ColorCorrectionWorkView />
    </ClientOnly>
  </div>
</template>
