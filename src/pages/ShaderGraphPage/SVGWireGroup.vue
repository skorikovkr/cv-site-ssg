<template>
  <g>
    <path
      v-for="wire in wires"
      :key="wire.id"
      :d="wire.path"
      stroke="gray"
      fill="transparent"
      stroke-width="3"
      class="bold-on-hover"
      @click="() => emits('wireClick', wire)"
    />
  </g>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps(['end', 'starts', 'originPoint'])

const emits = defineEmits(['wireClick'])

const wires = computed(() => {
  return (props.starts ?? [])
    .map((start, index) => {
      const endX = props.end.x
      const endY = props.end.y
      const startX = start?.x
      const startY = start?.y
      const width = start?.width
      if (start == null || endX == null || endY == null || width == null) return
      return {
        id: props.end.id + '.' + start.id + '.' + index,
        start: start.id,
        end: props.end.id,
        index,
        path: `M ${startX + width + props.originPoint.x + 5} ${
          startY + 25 + props.originPoint.y
        } C ${startX + width + 20 + props.originPoint.x} ${
          startY + 25 + props.originPoint.y
        }, ${endX - 20 + props.originPoint.x} ${
          endY + index * 15 + 25 + props.originPoint.y
        }, ${endX + props.originPoint.x + 5} ${endY + index * 15 + 25 + props.originPoint.y}`,
      }
    })
    .filter((n) => !!n)
})
</script>

<style scoped>
.bold-on-hover:hover {
  stroke-width: 5;
}
</style>
