<script setup>
import { ref } from 'vue';
import MyStackCard from './MyStackCard.vue';

const cards = ref([
    {
        imgSrc: "/src/assets/vue-logo.png",
        title: 'Vue',
        subtitle: 'Frontend framework',
        content: 'I use Vue for building UI for my web applications.'
    },
    {
        imgSrc: "/src/assets/asp-net-logo.png",
        title: 'ASP.NET',
        subtitle: 'Backend framework',
        content: 'I use ASP.NET (C#) for building backend for my applications.'
    },
    {
        imgSrc: "/src/assets/tailwind-logo.svg",
        title: 'Tailwind',
        subtitle: 'CSS framework',
        content: 'I use tailwind for styling my application with classes.'
    },
    {
        imgSrc: "/src/assets/prime-vue-logo.png",
        title: 'PrimeVue',
        subtitle: 'Components library',
        content: 'I use PrimeVue for ready components with pass through customization.'
    },
    {
        imgSrc: "/src/assets/pinia-logo.svg",
        title: 'Pinia',
        subtitle: 'State manager',
        content: 'I use Pinia when I need to use global state for my components.'
    }
])
</script>

<template>
    <div class="my-stack">
        <h2 class="text-3xl font-semibold mb-5">My stack</h2>
        <div class="flex gap-4 justify-around flex-wrap">
            <MyStackCard v-for="c in cards" :key="c.title" :img-src="c.imgSrc" :title="c.title" :subtitle="c.subtitle"
                :content="c.content" />
        </div>
    </div>
</template>