<template>
  <div class="min-w-[105px] mt-0">
    <NodeSelect
      v-model:model-value="uniform"
      :options="options"
      placeholder="Select type"
    >
      <template #label>Type</template>
    </NodeSelect>
  </div>
</template>

<script setup>
import { computed, ref, toValue, watch } from 'vue'
import NodeSelect from './UI/NodeSelect.vue'

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

const options = computed(() =>
  types.map((t) => ({
    key: t.name,
    label: t.name,
    value: t,
  })),
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
