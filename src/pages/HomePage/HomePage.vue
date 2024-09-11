<script setup>
import HeroSection from './HeroSection.vue';
import { useHead } from '@unhead/vue'
import { pageMeta } from './meta';
import MyStack from './MyStack.vue';

useHead({
    title: 'Home - skorikovkr',
    meta: pageMeta
})
</script>

<template>
    <div class="home-page__container">
        <HeroSection class="mb-12" />
        <MyStack />
    </div>
</template>