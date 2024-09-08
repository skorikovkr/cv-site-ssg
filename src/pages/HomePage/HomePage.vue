<script setup>
import HeroSection from './HeroSection.vue';
import Card from 'primevue/card';
import { useHead } from '@unhead/vue'

useHead({
    title: 'Home - skorikovkr',
    meta: [
        {
            name: 'description',
            content: "Hello, I'm Skorikov Kirill and this is my personal site.",
        },
    ],
})
</script>

<template>
    <div>
        <HeroSection />
        <div class="flex gap-2">
            <Card style="width: 25rem; overflow: hidden">
                <template #header>
                    <div class="pt-2 pl-2">
                        <img src="/src/assets/vue-logo.png" class="h-16" />
                    </div>
                </template>
                <template #title>Vue</template>
                <template #subtitle>Frontend framework</template>
                <template #content>
                    <p class="m-0">
                        I use Vue for building UI for my web applications.
                    </p>
                </template>
            </Card>
        </div>
    </div>
</template>