<template>
  <div class="min-w-[125px]">
    <Label class="text-xs">Extraction prop</Label>
    <NodeInput
      v-model.lazy="value"
      style="width: 90px"
      v-prevent-pointer-movement
    ></NodeInput>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import NodeInput from './UI/NodeInput.vue'
import { Label } from '@/components/ui/label'
import { vPreventPointerMovement } from '../utils/PreventPointerDirectiveMove'

const props = defineProps(['node'])

const value = ref(props.node.options.propertyName ?? 'x')

const emits = defineEmits(['updateNode'])

watch(
  [value],
  () => {
    emits('updateNode', props.node.id, {
      options: {
        propertyName: value.value,
      },
    })
  },
  {
    deep: true,
  },
)
</script>
