<script setup>
import Card from 'primevue/card';
import { useParallax, useElementHover } from '@vueuse/core'
import { ref, computed } from 'vue';

defineProps({
    imgSrc: {
        type: String
    },
    title: {
        type: String
    },
    subtitle: {
        type: String
    },
    content: {
        type: String
    },
})

const card = ref(null)
const { tilt, roll } = useParallax(card)
const isHovered = useElementHover(card)

const cardParallaxStyle = computed(() => ({
    transform: isHovered.value ? `
        rotateX(${roll.value * -40}deg) 
        rotateY(${tilt.value * -40}deg) 
        scale(1.33)` : 'scale(1)',
    zIndex: isHovered.value ? 1000 : 1
}))
</script>

<template>
    <Card ref="card" class="card w-96 overflow-hidden" :style="cardParallaxStyle">
        <template #header>
            <div class="pt-4 pl-4">
                <img :src="imgSrc" class="h-16" :alt="title" />
            </div>
        </template>
        <template #title>
            <h3>{{ title }}</h3>
        </template>
        <template #subtitle>{{ subtitle }}</template>
        <template #content>
            <p class="m-0">
                {{ content }}
            </p>
        </template>
    </Card>
</template>