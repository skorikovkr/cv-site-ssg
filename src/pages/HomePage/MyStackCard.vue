<script setup>
import { useParallax, useElementHover } from '@vueuse/core'
import { ref, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

defineProps({
  imgSrc: {
    type: String,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  content: {
    type: String,
  },
})

const card = ref(null)
const { tilt, roll } = useParallax(card)
const isHovered = useElementHover(card)

const cardParallaxStyle = computed(() => ({
  transform: isHovered.value
    ? `
        rotateX(${roll.value * -40}deg)
        rotateY(${tilt.value * -40}deg)
        scale(1.1)`
    : 'none',
  zIndex: isHovered.value ? 1000 : 1,
}))
</script>

<template>
  <Card
    ref="card"
    class="card card--smooth-transform w-72 xl:w-96 overflow-hidden"
    :style="cardParallaxStyle"
  >
    <CardHeader>
      <CardTitle>
        <h3>{{ title }}</h3></CardTitle
      >
      <CardDescription>
        <h4>{{ subtitle }}</h4>
        <div class="pt-4 pl-4">
          <img :src="imgSrc" class="h-16" :alt="title" /></div
      ></CardDescription>
    </CardHeader>

    <CardContent>
      <p class="m-0">
        {{ content }}
      </p>
    </CardContent>
  </Card>
</template>

<style scoped>
.card--smooth-transform {
  transition-property: transform;
  transition-timing-function: linear;
  transition-duration: 50ms;
}
</style>
