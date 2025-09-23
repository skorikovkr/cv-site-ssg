<template>
  <div
    style="padding: 0 35px 0 5px; display: flex; flex-direction: column; gap: 5px; margin-top: 0"
  >
    <div class="min-w-[105px]">
      <NodeSelect
        v-model:model-value="type"
        :options="options"
        placeholder="Select type"
      >
        <template #label>Type</template>
      </NodeSelect>
    </div>

    <div v-if="type === 'float'">
      <NodeInput
        v-model.lazy="value"
        style="width: 70px"
        v-prevent-pointer-movement
      ></NodeInput>
    </div>

    <template v-else>
      <template v-if="type === 'vec2' || type === 'vec3' || type === 'vec4'">
        <div class="value-node__input">
          <div class="text-sm font-medium">x:</div>
          <NodeInput
            v-model.lazy="x"
            style="width: 80px"
            v-prevent-pointer-movement
          ></NodeInput>
        </div>
        <div class="value-node__input">
          <div class="text-sm font-medium">y:</div>
          <NodeInput
            v-model.lazy="y"
            style="width: 80px"
            v-prevent-pointer-movement
          ></NodeInput>
        </div>
      </template>

      <div v-if="type === 'vec3' || type === 'vec4'">
        <div class="value-node__input">
          <div class="text-sm font-medium">z:</div>
          <NodeInput
            v-model.lazy="z"
            style="width: 80px"
            v-prevent-pointer-movement
          ></NodeInput>
        </div>
      </div>

      <div v-if="type === 'vec4'">
        <div class="value-node__input">
          <div class="text-sm font-medium">w:</div>
          <NodeInput
            v-model.lazy="w"
            style="width: 80px"
            v-prevent-pointer-movement
          ></NodeInput>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, toValue, watch } from 'vue'
import { vPreventPointerMovement } from '../utils/PreventPointerDirectiveMove'
import NodeSelect from './UI/NodeSelect.vue'
import NodeInput from './UI/NodeInput.vue'

const props = defineProps(['node'])

const initialValue = toValue(props.node?.options?.value ?? 0)
const parts = initialValue.split(/[,()]/)
const value = ref(initialValue)
const x = ref(parts[1] ?? '')
const y = ref(parts[2] ?? '')
const z = ref(parts[3] ?? '')
const w = ref(parts[4] ?? '')
const type = ref(toValue(props.node?.dataType ?? 'float'))
const types = ['float', 'vec2', 'vec3', 'vec4']

const options = computed(() =>
  types.map((t) => ({
    key: t,
    value: t,
    label: t,
  })),
)

const emits = defineEmits(['updateNode'])

watch(type, () => {
  x.value = ''
  y.value = ''
  z.value = ''
  w.value = ''
  value.value = ''
})

watch([value, x, y, z, w, type], () => {
  const dottedX = x.value.indexOf('.') > -1 ? x.value : x.value + '.'
  const dottedY = y.value.indexOf('.') > -1 ? y.value : y.value + '.'
  const dottedZ = z.value.indexOf('.') > -1 ? z.value : z.value + '.'
  const dottedW = w.value.indexOf('.') > -1 ? w.value : w.value + '.'
  const dottedValue = value.value.indexOf('.') > -1 ? value.value : value.value + '.'
  let val = null
  const dataType = type.value
  switch (type.value) {
    case 'float':
      val = dottedValue
      break
    case 'vec2':
      val = `vec2(${dottedX},${dottedY})`
      break
    case 'vec3':
      val = `vec3(${dottedX},${dottedY},${dottedZ})`
      break
    case 'vec4':
      val = `vec4(${dottedX},${dottedY},${dottedZ},${dottedW})`
      break
  }
  if (val) {
    emits('updateNode', props.node.id, {
      options: {
        value: val,
      },
      dataType,
    })
  }
})
</script>

<style>
.value-node__input {
  display: flex;
  gap: 5px;
  justify-content: space-between;
  align-items: center;
}
</style>
