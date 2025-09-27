<template>
  <div class="min-w-[165px]">
    <NodeSelect
      v-model:model-value="arg"
      :options="options"
      placeholder="Select argument"
    >
      <template #label>Argument</template>
    </NodeSelect>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { injectShaderGraphController } from '../useShaderGraphController'
import NodeSelect from './UI/NodeSelect.vue'

const shaderGraphStore = injectShaderGraphController()

const { functions, currentFunctionId } = shaderGraphStore

const args = computed(() => functions.value?.[currentFunctionId.value]?.inputsNames ?? [])

const props = defineProps(['node'])

const arg = ref(args.value.find((a) => a === props.node?.options?.name))

const emits = defineEmits(['updateNode'])

const options = computed(() =>
  args.value.map((v) => ({
    key: v,
    label: v,
    value: v,
  })),
)

watch(arg, () => {
  if (arg.value) {
    const i = args.value.findIndex((a) => a === arg.value)
    emits('updateNode', props.node.id, {
      options: {
        name: arg.value,
      },
      dataType: functions.value?.[currentFunctionId.value]?.inputTypes[i] ?? null,
    })
  }
})
</script>
