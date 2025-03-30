import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRootStore = defineStore('root-store', () => {
  const ready = ref(false)
  const test = ref(0)

  function initialize() {
    test.value = 1
  }

  return {
    test,
    ready,

    initialize,
  }
})
