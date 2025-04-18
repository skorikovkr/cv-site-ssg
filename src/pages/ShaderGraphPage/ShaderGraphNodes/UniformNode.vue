<template>
  <div>
    <select
      v-model="uniform"
      style="width: 60px"
    >
      <option
        v-for="t in types"
        :key="t.name"
        :value="t"
      >
        {{ t.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, toValue, watch } from 'vue'

const props = defineProps(['node'])

const types = [
  {
    name: 'u_time',
    dataType: 'float',
  },
  {
    name: 'u_mouse',
    dataType: 'vec2',
  },
  {
    name: 'u_resolution',
    dataType: 'vec2',
  },
]
const uniform = ref(
  types.find((t) => t.name === toValue(props.node?.options?.uniformName)) ?? types[0],
)

const emits = defineEmits(['updateNode'])

watch(uniform, () => {
  emits('updateNode', props.node.id, {
    options: {
      uniformName: uniform.value.name,
    },
    dataType: uniform.value.dataType,
  })
})
</script>
