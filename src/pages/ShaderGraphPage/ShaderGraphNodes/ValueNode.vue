<template>
  <div style="padding: 0 35px 0 5px; display: flex; flex-direction: column; gap: 5px">
    <select v-model="type">
      <option
        v-for="t in types"
        :key="t"
        :value="t"
      >
        {{ t }}
      </option>
    </select>

    <div v-if="type === 'float'">
      <input
        v-model.lazy="value"
        style="width: 30px"
        v-prevent-pointer-movement
      />
    </div>

    <template v-else>
      <template v-if="type === 'vec2' || type === 'vec3' || type === 'vec4'">
        <div style="display: flex; gap: 5px">
          <div>x:</div>
          <input
            v-model.lazy="x"
            style="width: 30px"
            v-prevent-pointer-movement
          />
        </div>
        <div style="display: flex; gap: 5px">
          <div>y:</div>
          <input
            v-model.lazy="y"
            style="width: 30px"
            v-prevent-pointer-movement
          />
        </div>
      </template>

      <div v-if="type === 'vec3' || type === 'vec4'">
        <div style="display: flex; gap: 5px">
          <div>z:</div>
          <input
            v-model.lazy="z"
            style="width: 30px"
            v-prevent-pointer-movement
          />
        </div>
      </div>

      <div v-if="type === 'vec4'">
        <div style="display: flex; gap: 5px">
          <div>w:</div>
          <input
            v-model.lazy="w"
            style="width: 30px"
            v-prevent-pointer-movement
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, toValue, watch } from 'vue'
import { vPreventPointerMovement } from '../utils/PreventPointerDirectiveMove'

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
