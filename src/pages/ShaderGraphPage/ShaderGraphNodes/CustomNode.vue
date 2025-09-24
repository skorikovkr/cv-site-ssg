<template>
  <div class="min-w-[125px] px-6 mt-0">
    <Label class="text-xs">Function name</Label>
    <NodeInput
      v-model.lazy="value"
      style="width: 85px"
      v-prevent-pointer-movement
    ></NodeInput>

    <Label class="text-xs">Input</Label>
    <TagsInput
      v-model="input"
      class="p-1 max-w-[200px]"
    >
      <TagsInputItem
        v-for="item in input"
        :key="item"
        :value="item"
      >
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>

      <div>
        <NodeSelect
          v-model:model-value="tempInput"
          :options="options"
          placeholder="Select input"
        >
        </NodeSelect>
      </div>
    </TagsInput>

    <NodeSelect
      v-model:model-value="output"
      :options="options"
      class="w-[100px]"
      placeholder="Select output"
    >
      <template #label>Output</template>
    </NodeSelect>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import NodeInput from './UI/NodeInput.vue'
import { Label } from '@/components/ui/label'
import { vPreventPointerMovement } from '../utils/PreventPointerDirectiveMove'
import NodeSelect from './UI/NodeSelect.vue'
import {
  TagsInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input'

const props = defineProps(['node'])

const types = ['float', 'vec2', 'vec3', 'vec4']

const value = ref()
const input = ref(['float'])
const output = ref('float')
const tempInput = ref(null)

const emits = defineEmits(['updateNode'])

const options = computed(() =>
  types.map((v) => ({
    key: v,
    label: v,
    value: v,
  })),
)

watch(tempInput, (val) => {
  if (val) {
    input.value.push(val)
    tempInput.value = null
  }
})

watch(
  [value, input, output],
  () => {
    emits('updateNode', props.node.id, {
      options: {
        functionName: value.value,
      },
      dataType: output.value,
      inputTypes: input.value,
      inputs: input.value.map(() => null),
    })
  },
  {
    deep: true,
  },
)
</script>
