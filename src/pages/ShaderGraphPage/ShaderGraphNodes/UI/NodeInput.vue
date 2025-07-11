<template>
  <LazyInput
    v-model="modelValue"
    class="p-1 px-2 h-auto"
  ></LazyInput>
</template>

<script setup lang="ts">
import { LazyInput } from '@/components/ui/lazy-input'

const modelValue = defineModel<string | undefined>()
</script>
