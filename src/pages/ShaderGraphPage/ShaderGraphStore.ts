import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useShaderGraphStore = defineStore('shaderGraphStore', () => {
  const originPoint = ref({
    x: 0,
    y: 0,
  })

  return {
    originPoint,
  }
})
