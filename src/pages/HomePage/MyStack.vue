<script setup>
import { ref } from 'vue'
import MyStackCard from './MyStackCard.vue'

const cards = ref([
  {
    imgSrc: '/images/vue-logo.png',
    title: 'Vue',
    subtitle: 'Frontend framework',
    content: 'I use Vue for building UI for my web applications.',
  },
  {
    imgSrc: '/images/tailwind-logo.svg',
    title: 'Tailwind',
    subtitle: 'CSS framework',
    content: 'I use tailwind for styling my application with classes.',
  },
  {
    imgSrc: '/images/pinia-logo.svg',
    title: 'Pinia',
    subtitle: 'State manager',
    content: 'I use Pinia when I need manage state for my components.',
  },
])
</script>

<template>
  <section class="my-stack">
    <h2 class="text-3xl font-semibold mb-5">My stack</h2>
    <div class="flex gap-4 justify-center flex-wrap relative">
      <MyStackCard
        v-for="c in cards"
        :key="c.title"
        :img-src="c.imgSrc"
        :title="c.title"
        :subtitle="c.subtitle"
        :content="c.content"
      />
    </div>
  </section>
</template>
