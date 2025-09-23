<template>
  <div class="min-w-[165px]">
    <NodeSelect
      v-model:model-value="func"
      :options="options"
      placeholder="Select function"
    >
      <template #label>Functions</template>
    </NodeSelect>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { injectShaderGraphController } from '../useShaderGraphController'
import NodeSelect from './UI/NodeSelect.vue'

const shaderGraphStore = injectShaderGraphController()

const { functions } = shaderGraphStore

const customFunctions = computed(() =>
  (Object.keys(functions.value).filter((f) => f !== 'main') ?? []).map((k) => functions.value[k]),
)

const props = defineProps(['node'])

const func = ref(customFunctions.value.find((f) => f.id === props.node?.options?.id))

const emits = defineEmits(['updateNode'])

const options = computed(() =>
  customFunctions.value.map((v) => ({
    key: v.id,
    label: v.name,
    value: v,
  })),
)

watch(func, () => {
  if (func.value?.id) {
    emits('updateNode', props.node.id, {
      options: {
        id: func.value.id,
      },
      dataType: functions.value[func.value.id].output,
      inputTypes: functions.value[func.value.id].inputTypes,
      inputs: functions.value[func.value.id].inputTypes.map(() => null),
    })
  }
})
</script>
