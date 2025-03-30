<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    size: string
  }>(),
  {
    size: '14px',
  },
)
</script>

<template>
  <LoaderCircle
    class="animate-spin"
    :style="{
      width: size,
      height: size,
    }"
  />
</template>
