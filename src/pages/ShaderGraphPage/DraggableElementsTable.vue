<template>
  <div style="display: grid; grid-template-columns: 1fr 1fr">
    <pre style="max-height: 200px; min-height: 200px; overflow: scroll">{{ result?.result }}</pre>
    <div>
      <div style="display: grid; grid-template-columns: 1fr 1fr">
        <label>Name</label>
        <input v-model="newFunction.name" />
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr">
        <label>Output</label>
        <input v-model="newFunction.output" />
      </div>
      <button @click="handleAddFunction">Create</button>
    </div>
  </div>
  <input @change="(e) => handleNewNodeChange(e.target.value)" />
  <button @click="hanldeDeleteNodeClick">delete node</button>
  <button @click="hanldeDeleteWireClick">delete wire</button>
  <select v-model="currentFunctionId">
    <option
      v-for="key in functionsKeys"
      :key="key"
      :value="key"
    >
      {{ functions[key].name }}
    </option>
  </select>
  <div style="height: 500px">
    <div
      class="table no-touch-action"
      ref="el"
      @pointerdown.stop="handlePointerDown"
      @pointermove.stop="pan"
      @pointerup.stop="handlePointerUp"
      @mousedown="handleMouseDown"
    >
      <svg
        style="
          position: absolute;
          overflow: hidden;
          height: 100%;
          width: 100%;
          right: 0;
          z-index: 1;
        "
        xmlns="http://www.w3.org/2000/svg"
      >
        <SVGWireGroup
          v-for="w in wires"
          :origin-point="originPoint"
          :key="w.id"
          :end="w.end"
          :node-width="w.width"
          :starts="w.starts"
          @wire-click="handleWireClick"
        />
        <path
          v-if="newWire"
          :d="newWire.coords"
          stroke="black"
          fill="transparent"
          stroke-width="3"
        />
      </svg>
      <div style="position: relative; z-index: 2">
        <DraggableElement
          v-for="n in functions[currentFunctionId].nodes"
          :node="n"
          :nodeCoord="nodesCoords[currentFunctionId].nodes[n.id]"
          :key="`${n.id}.${currentFunctionId}`"
          :is-dragging="n.id === draggingNodeId"
          @update-node="handleUpdateNode"
          @pin-clicked="handlePinClicked"
          @click="handleNodeClick"
          @width:update="handleWidthUpdate"
          @pointer-down="handlePointerDownOnNode"
        >
        </DraggableElement>
      </div>
    </div>
  </div>
  <pre>{{ functions }}</pre>
</template>

<script setup lang="ts">
import { useThrottleFn } from '@vueuse/core'
import { computed, onMounted, onUnmounted, provide, ref, toValue, watch } from 'vue'
import DraggableElement from './DraggableElement.vue'
import { GenerateGlslCode } from './utils/GenerateGlslCode'
import SVGWireGroup from './SVGWireGroup.vue'
import { getRandInt } from './utils/GetRandInt'
import { NodeTypesMap } from './utils/NodeTypesMap'
import { useShaderGraphStore } from './ShaderGraphStore'
import { storeToRefs } from 'pinia'

const props = defineProps(['initialFunctions', 'initialNodesCoords'])

const shaderGraphStore = useShaderGraphStore()

const { originPoint } = storeToRefs(shaderGraphStore)

const functions = ref(toValue(props.initialFunctions))
const nodesCoords = ref(toValue(props.initialNodesCoords))
const newWire = ref(null)
const currentFunctionId = ref('main')
const el = ref()
const startOriginX = ref(0)
const startOriginY = ref(0)
const startX = ref(0)
const startY = ref(0)
const cursorX = ref(0)
const cursorY = ref(0)
const isPanning = ref(false)
const draggingNodeId = ref(null)
const draggingPointerCoords = ref({
  x: 0,
  y: 0,
})
const newFunction = ref<{
  id: null | string
  name: string
  inputTypes: string[]
  inputsNames: string[]
  output: string | null
}>({
  id: null,
  name: '',
  inputTypes: [],
  inputsNames: [],
  output: null,
})

provide('functions', functions)
provide('nodesCoords', nodesCoords)
provide('cursorPosition', {
  cursorX,
  cursorY,
})
provide('isPanning', isPanning)

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

function handleAddFunction() {
  let id = `function${getRandInt(0, 999999)}`
  while (Object.keys(functions.value).find((k) => k === id)) {
    id = `function${getRandInt(0, 999999)}`
  }
  newFunction.value.id = id
  functions.value[id] = {
    ...newFunction.value,
    nodes: {},
  }
  nodesCoords.value[id] = {
    nodes: {},
  }
  newFunction.value = {
    id: null,
    name: '',
    inputTypes: [],
    inputsNames: [],
    output: null,
  }
}

function handlePointerDown(e) {
  if (!draggingNodeId.value) {
    startX.value = e.clientX
    startY.value = e.clientY
    startOriginX.value = originPoint.value.x
    startOriginY.value = originPoint.value.y
    isPanning.value = true
  }
}

function handlePointerMove(e) {
  const rect = el.value?.getBoundingClientRect()
  cursorX.value = e.clientX - (rect?.left ?? 0)
  cursorY.value = e.clientY - (rect?.top ?? 0)
  if (draggingNodeId.value) {
    nodesCoords.value[currentFunctionId.value].nodes[draggingNodeId.value] = {
      x: cursorX.value - originPoint.value.x - draggingPointerCoords.value.x,
      y: cursorY.value - originPoint.value.y - draggingPointerCoords.value.y,
    }
    throttledUpdateAllWires()
  }
}

function pan(e) {
  handlePointerMove(e)
  if (isPanning.value) {
    const deltaX = startX.value - e.clientX
    const deltaY = startY.value - e.clientY
    originPoint.value.x = startOriginX.value - deltaX
    originPoint.value.y = startOriginY.value - deltaY
  }
}

function handlePointerDownOnNode(node, pointerPos) {
  if (!newWire.value) {
    draggingNodeId.value = node?.id
    draggingPointerCoords.value = pointerPos
  }
}

function handlePointerUp() {
  isPanning.value = false
  draggingNodeId.value = null
  draggingPointerCoords.value = {
    x: 0,
    y: 0,
  }
}

function handleMouseDown(e) {
  if (e.button === 2) {
    newWire.value = null
  }
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    newWire.value = null
  }
}

const functionsKeys = computed(() => Object.keys(functions.value))

// wires - group of wires which are ending in one point
const wires = ref([])
function updateWires(nodeId) {
  const existingWireIndex = wires.value.findIndex((w) => w.id === nodeId)
  const coords = nodesCoords.value[currentFunctionId.value].nodes[nodeId]
  if (existingWireIndex !== -1) {
    if (!functions.value[currentFunctionId.value].nodes[nodeId]) {
      wires.value.splice(existingWireIndex, 1)
      return
    }
    const wire = wires.value[existingWireIndex]
    wire.starts = functions.value[currentFunctionId.value].nodes[nodeId].inputs?.map((i) =>
      i
        ? {
            id: i,
            x: nodesCoords.value[currentFunctionId.value].nodes[i]?.x ?? 0,
            y: nodesCoords.value[currentFunctionId.value].nodes[i]?.y ?? 0,
            width: nodesCoords.value[currentFunctionId.value].nodes[i]?.width ?? 100,
          }
        : null,
    )
    wire.end.x = coords?.x ?? 0
    wire.end.y = coords?.y ?? 0
  } else {
    wires.value.push({
      id: nodeId,
      starts: functions.value[currentFunctionId.value].nodes[nodeId].inputs?.map((i) =>
        i
          ? {
              id: i,
              x: nodesCoords.value[currentFunctionId.value].nodes[i]?.x ?? 0,
              y: nodesCoords.value[currentFunctionId.value].nodes[i]?.y ?? 0,
              width: nodesCoords.value[currentFunctionId.value].nodes[i]?.width ?? 100,
            }
          : null,
      ),
      end: {
        id: nodeId,
        x: coords?.x ?? 0,
        y: coords?.y ?? 0,
      },
    })
  }
}

const updateAllWires = () => {
  Object.keys(functions.value[currentFunctionId.value].nodes).forEach((n) => {
    updateWires(n)
  })
}

watch(
  currentFunctionId,
  () => {
    wires.value = []
    let nodesWithoutCoords = 0
    originPoint.value = { x: 0, y: 0 }
    Object.keys(functions.value[currentFunctionId.value].nodes).forEach((n) => {
      let nodeCoord = nodesCoords.value[currentFunctionId.value].nodes[n]
      if (!nodeCoord) {
        nodesCoords.value[currentFunctionId.value].nodes[n] = {}
        nodeCoord = nodesCoords.value[currentFunctionId.value].nodes[n]
      }
      if (!nodeCoord.x && !nodeCoord.y) {
        nodeCoord.x = nodesWithoutCoords * 50
        nodeCoord.y = nodesWithoutCoords * 50
        nodesWithoutCoords++
      }
    })
    updateAllWires()
  },
  {
    immediate: true,
  },
)

const handleNewNodeChange = (nodeTypeName) => {
  const nodeType = NodeTypesMap.get(nodeTypeName)
  if (nodeType) {
    const name = nodeType + getRandInt(100000, 999999).toString()
    const defaultOptions = {}
    nodeType.options?.forEach((o, index) => {
      defaultOptions[o] = nodeType.defaultOptions[index]
    })
    functions.value[currentFunctionId.value].nodes[name] = {
      type: nodeTypeName,
      dataType: nodeType.dataTypes?.[0]?.[0] ?? null,
      id: name,
      inputs: nodeType.inputs?.[0]?.map(() => null),
      inputTypes: nodeType.inputs?.[0],
      options: defaultOptions,
    }
    if (!nodesCoords.value[currentFunctionId.value]) {
      nodesCoords.value[currentFunctionId.value] = {
        x: 0,
        y: 0,
        nodes: {},
      }
    }
    nodesCoords.value[currentFunctionId.value].nodes[name] = {
      x: 0,
      y: 0,
    }
  }
}

const throttledUpdateAllWires = useThrottleFn(() => {
  updateAllWires()
}, 25)

const handleUpdateNode = (nodeId, nodeConfig) => {
  const node = functions.value[currentFunctionId.value].nodes[nodeId]
  const options = node.options ?? {}
  if (nodeConfig.options) {
    Object.keys(nodeConfig.options).forEach((k) => {
      options[k] = nodeConfig.options[k]
    })
    node.options = options
  }
  if (nodeConfig.dataType) {
    node.dataType = nodeConfig.dataType
    Object.keys(functions.value[currentFunctionId.value].nodes).forEach((k) => {
      functions.value[currentFunctionId.value].nodes[k].inputs?.forEach((i, index) => {
        if (nodeId === i) {
          functions.value[currentFunctionId.value].nodes[k].inputs[index] = null
          updateWires(k)
        }
      })
    })
  }
  if (nodeConfig.inputTypes) {
    node.inputTypes = nodeConfig.inputTypes
  }
  if (nodeConfig.inputs) {
    node.inputs = nodeConfig.inputs
  }
  updateWires(nodeId)
}

const selectedWire = ref(null)
const handleWireClick = (wire) => {
  selectedWire.value = wire
}
const hanldeDeleteWireClick = () => {
  const nodeKey = Object.keys(functions.value[currentFunctionId.value].nodes).find(
    (k) => k === selectedWire.value?.end,
  )
  if (nodeKey) {
    functions.value[currentFunctionId.value].nodes[nodeKey].inputs[selectedWire.value.index] = null
    updateWires(selectedWire.value.end)
    selectedWire.value = null
  }
}

const selectedNode = ref(null)
const handleNodeClick = (node) => {
  selectedNode.value = node
}
const hanldeDeleteNodeClick = () => {
  const id = selectedNode.value.id
  Object.keys(functions.value[currentFunctionId.value].nodes).forEach((k) => {
    functions.value[currentFunctionId.value].nodes[k].inputs?.forEach((i, index) => {
      if (id === i) {
        functions.value[currentFunctionId.value].nodes[k].inputs[index] = null
        updateWires(k)
      }
    })
  })
  delete functions.value[currentFunctionId.value].nodes[id]
  delete nodesCoords.value[id]
  updateWires(id)
  selectedNode.value = null
}

const result = ref('')
watch(
  functions,
  () => {
    const root = functions.value.main
    if (root) {
      console.log('GenerateGlslCode')
      result.value = GenerateGlslCode(toValue(root), toValue(functions), {
        precision: 'mediump',
      })
    } else {
      result.value = null
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

const handlePinClicked = ({ type, isInput, innerX, innerY, index, node }, { x, y }) => {
  if (!newWire.value) {
    const startControlPoints = {
      first: {
        x: innerX + x,
        y: innerY + y,
      },
      second: {
        x: innerX + x + (isInput ? -30 : 30),
        y: innerY + y,
      },
    }
    const startCoords = `M ${
      startControlPoints.first.x + originPoint.value.x
    } ${startControlPoints.first.y + originPoint.value.y} C ${
      startControlPoints.second.x + originPoint.value.x
    } ${startControlPoints.second.y + originPoint.value.y}, `
    const endCoords = `${startControlPoints.first.x + originPoint.value.x} ${
      startControlPoints.first.y + originPoint.value.y
    }, ${startControlPoints.second.x + originPoint.value.x} ${
      startControlPoints.second.y + originPoint.value.y
    }`
    const coords = startCoords + endCoords
    const prevCoords = newWire.value?.coords ?? coords
    newWire.value = {
      isInput,
      index,
      type,
      nodeId: node.id,
      coords, // endCoords changes with Pointer movement
      prevCoords,
      startControlPoints, // they are always the same
    }
  } else {
    if (newWire.value.isInput === isInput) return
    if (newWire.value.isInput) {
      const inputs = functions.value[currentFunctionId.value].nodes[newWire.value.nodeId]?.inputs
      if (inputs) {
        inputs[newWire.value.index] = node.id
      }
    } else {
      const inputs = functions.value[currentFunctionId.value].nodes[node.id]?.inputs
      if (inputs) {
        inputs[index] = newWire.value.nodeId
      }
    }
    updateWires(node.id)
    newWire.value = null
  }
}

const throttledHandleNewWireMove = useThrottleFn(() => {
  const coords = {
    first: {
      x: cursorX.value - 30,
      y: cursorY.value,
    },
    second: {
      x: cursorX.value,
      y: cursorY.value,
    },
  }
  const startCoords = `M ${
    newWire.value.startControlPoints.first.x + originPoint.value.x
  } ${newWire.value.startControlPoints.first.y + originPoint.value.y} C ${
    newWire.value.startControlPoints.second.x + originPoint.value.x
  } ${newWire.value.startControlPoints.second.y + originPoint.value.y}, `
  newWire.value.coords =
    startCoords + `${coords.first.x} ${coords.first.y}, ${coords.second.x} ${coords.second.y}`
}, 30)

watch([cursorX, cursorY], () => {
  if (newWire.value) {
    throttledHandleNewWireMove()
  }
})

const handleWidthUpdate = (node, width) => {
  nodesCoords.value[currentFunctionId.value].nodes[node.id].width = width
  updateAllWires()
}
</script>

<style scoped>
.no-touch-action {
  touch-action: none;
}

.table {
  background-color: gray;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
</style>
