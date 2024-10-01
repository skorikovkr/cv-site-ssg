<script setup>
import { defineAsyncComponent } from 'vue'
import { useHead } from '@unhead/vue'
import { pageMeta } from './meta';

useHead({
    title: 'Metronome - skorikovkr',
    meta: pageMeta
})

const MetronomeWorkView = defineAsyncComponent(() =>
    import('./MetronomeWorkView.vue')
)

</script>

<template>
    <div class="metronome text-xl">
        <h1 class="text-3xl font-semibold mb-4">Metronome</h1>
        <p class="mb-1">This is metronome web application.</p>
        <p class="mb-1">Use <i>BPM slider</i> to change tempo.</p>
        <p class="mb-1">Use <i>time signature</i> field to make accent on first beat.</p>
        <p class="mb-4">Click on <i>circles</i> to highlight corresponding beat with louder sound.</p>
        <ClientOnly>
            <MetronomeWorkView />
        </ClientOnly>
    </div>
</template>