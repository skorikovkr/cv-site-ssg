<script setup>
import HeroSection from './HeroSection.vue'
import { useHead } from '@unhead/vue'
import { pageMeta } from './meta'
import MyStack from './MyStack.vue'
import MyProjects from './MyProjects.vue'
import HomePageFooter from './HomePageFooter.vue'

useHead({ title: 'Home - skorikovkr', meta: pageMeta })
</script>

<template>
  <div class="home-page__container flex flex-col gap-12">
    <HeroSection />
    <MyStack />
    <MyProjects />
    <HomePageFooter />
  </div>
</template>
