<script setup>
import { defineAsyncComponent } from 'vue'
import { useHead } from '@unhead/vue'
import { pageMeta } from './meta'

useHead({
  title: 'Metronome - skorikovkr',
  meta: pageMeta,
})

const MetronomeWorkView = defineAsyncComponent(() => import('./MetronomeWorkView.vue'))
</script>

<template>
  <div class="metronome">
    <h1 class="text-3xl font-semibold mb-4">Metronome</h1>
    <p>This is metronome web application.</p>
    <p>Use <i>BPM slider</i> to change tempo.</p>
    <p>Use <i>time signature</i> field change number of beats.</p>
    <p class="mb-4">Click on <i>circles</i> to highlight corresponding beat with louder sound.</p>
    <ClientOnly>
      <MetronomeWorkView />
    </ClientOnly>
  </div>
</template>
