<script setup>
import Card from 'primevue/card';

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
</script>

<template>
    <Card style="width: 25rem; overflow: hidden">
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