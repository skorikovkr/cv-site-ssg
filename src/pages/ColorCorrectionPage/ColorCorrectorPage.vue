<script setup>
import { defineAsyncComponent } from 'vue'
import { useHead } from '@unhead/vue'

useHead({
    title: 'Color correction - skorikovkr',
    meta: [
        {
            name: 'description',
            content: "Simple color correction web application.",
        },
    ],
})

const ColorCorrectionWorkView = defineAsyncComponent(() =>
    import('./ColorCorrectionWorkView.vue')
)
</script>

<template>
    <div>
        <h1>Color correction app</h1>
        <p>This is web application for color correction.</p>
        <p>Create and move dots to change image's colors.</p>
        <p>Use mouse scroll to zoom image.</p>
        <ClientOnly>
            <ColorCorrectionWorkView />
        </ClientOnly>
    </div>
</template>