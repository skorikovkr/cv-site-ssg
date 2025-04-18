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
import SVGWireGroup from './SVGWireGroup.vue'
import { useShaderGraphStore } from './ShaderGraphStore'
import { storeToRefs } from 'pinia'

const shaderGraphStore = useShaderGraphStore()

const {
  originPoint,
  isPanning,
  cursorX,
  cursorY,
  functions,
  nodesCoords,
  currentFunctionId,
  newFunction,
  newWire,
  wires,
  selectedWire,
  selectedNode,
  result,
} = storeToRefs(shaderGraphStore)

const el = ref()
const startOriginX = ref(0)
const startOriginY = ref(0)
const startX = ref(0)
const startY = ref(0)
const draggingNodeId = ref(null)
const draggingPointerCoords = ref({
  x: 0,
  y: 0,
})

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

function handleAddFunction() {
  shaderGraphStore.addFunction(newFunction.value)
  shaderGraphStore.resetNewFunction()
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
    shaderGraphStore.updateAllWires()
  },
  {
    immediate: true,
  },
)

const handleNewNodeChange = (nodeTypeName) => {
  shaderGraphStore.addNode(nodeTypeName)
}

const throttledUpdateAllWires = useThrottleFn(() => {
  shaderGraphStore.updateAllWires()
}, 25)

const handleUpdateNode = (nodeId, nodeConfig) => {
  shaderGraphStore.updateNode(nodeId, nodeConfig)
}

const handleWireClick = (wire) => {
  selectedWire.value = wire
}

const hanldeDeleteWireClick = () => {
  shaderGraphStore.deleteWire(selectedWire.value)
  selectedWire.value = null
}

const handleNodeClick = (node) => {
  selectedNode.value = node
}
const hanldeDeleteNodeClick = () => {
  shaderGraphStore.deleteNode(selectedNode.value)
  selectedNode.value = null
}

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
    shaderGraphStore.updateWires(node.id)
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
  shaderGraphStore.updateAllWires()
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
