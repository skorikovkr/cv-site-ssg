<template>
  <div
    ref="el"
    class="draggable prevent-select"
    :style="{
      top: transformedY + 'px',
      left: transformedX + 'px',
      userSelect: isDragging ? 'none' : 'auto',
      zIndex: isDragging ? 4 : 3,
    }"
    style="position: absolute; background-color: burlywood; min-height: 100px; min-width: 100px"
    @click="() => emits('click', node)"
  >
    <div
      class="draggable__header"
      @pointerdown.stop="handlePointerDown"
    >
      {{ node.type }}
    </div>
    <div
      v-if="node.inputs"
      class="input-points"
    >
      <div
        v-for="p in inputPoints"
        :key="p.y"
        :style="{
          top: p.y + 'px',
          left: p.x + 'px',
        }"
        style="
          position: absolute;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          background-color: blue;
        "
        @click="
          () =>
            handlePinClick(p, {
              x,
              y,
            })
        "
        v-prevent-pointer-movement
      >
        <div style="position: absolute; left: 10px; top: -4px">
          {{ p.type }}
        </div>
      </div>
    </div>
    <div
      v-if="node.dataType"
      class="output-points"
    >
      <div
        :style="{
          top: outputPoint.y + 'px',
        }"
        @click="
          () =>
            handlePinClick(outputPoint, {
              x,
              y,
            })
        "
        style="
          position: absolute;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          background-color: green;
          right: -5px;
        "
        v-prevent-pointer-movement
      >
        <div style="position: absolute; right: 10px; top: -4px; text-align: right">
          {{ outputPoint.type }}
        </div>
      </div>
    </div>
    <div style="padding-top: 5px; padding-bottom: 10px">
      <component
        :is="ShaderGraphNodes[node.type]"
        :node="node"
        @updateNode="handleNodeOptionChanged"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ShaderGraphNodes } from './ShaderGraphNodes/ShaderGraphNodes'
import { vPreventPointerMovement } from './utils/PreventPointerDirectiveMove'
import { useShaderGraphStore } from './ShaderGraphStore'
import { storeToRefs } from 'pinia'

const el = ref(null)

const shaderGraphStore = useShaderGraphStore()

const { originPoint } = storeToRefs(shaderGraphStore)

const props = defineProps(['node', 'nodeCoord', 'isDragging'])

const emits = defineEmits([
  'pinClicked',
  'positionChanged',
  'updateNode',
  'click',
  'width:update',
  'pointerDown',
])

const width = ref(100)
const x = computed(() => props.nodeCoord.x)
const y = computed(() => props.nodeCoord.y)
const transformedX = computed(() => originPoint.value.x + x.value)
const transformedY = computed(() => originPoint.value.y + y.value)

onMounted(() => {
  width.value = el.value?.getBoundingClientRect().width ?? 100
})

watch(
  width,
  (val) => {
    emits('width:update', props.node, val)
  },
  {
    immediate: true,
  },
)

const inputPoints = computed(() => {
  const points = props.node?.inputs ?? []
  const res = points.map((p, i) => {
    return {
      index: i,
      isInput: true,
      type: props.node.inputTypes?.[i] ?? '?',
      x: -5,
      y: 20 + 15 * i++,
    }
  })
  return res
})

const outputPoint = computed(() => {
  if (props.node?.dataType)
    return {
      type: props.node.dataType ?? '?',
      isInput: false,
      x: width.value,
      y: 20,
    }
  return null
})

const handlePinClick = (pin, draggableCoords) => {
  emits(
    'pinClicked',
    {
      ...pin,
      node: props.node,
      innerX: pin.x + 5, // чтобы центр был с центра кружка, а не левого верхнего края
      innerY: pin.y + 5,
    },
    draggableCoords,
  )
}

const handleNodeOptionChanged = (nodeId, newNodeConfig) => {
  emits('updateNode', nodeId, newNodeConfig)
}

function handlePointerDown(e) {
  const rect = el.value?.getBoundingClientRect()
  emits('pointerDown', props.node, {
    x: e.clientX - (rect?.left ?? 0),
    y: e.clientY - (rect?.top ?? 0),
  })
}
</script>

<style scoped>
.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.draggable {
  touch-action: none;
  position: absolute;
  z-index: 1;
}

.draggable__header {
  cursor: move;
  z-index: 2;
}
</style>
