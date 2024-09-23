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
        <h1 class="text-3xl font-semibold mb-4">Metronome app</h1>
        <p>This is metronome web application.</p>
        <ClientOnly>
            <MetronomeWorkView />
        </ClientOnly>
    </div>
</template>