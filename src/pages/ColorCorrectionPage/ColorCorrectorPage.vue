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
    <ClientOnly>
      <ColorCorrectionWorkView />
    </ClientOnly>
  </div>
</template>
