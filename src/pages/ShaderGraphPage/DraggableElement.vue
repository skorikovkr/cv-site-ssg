<template>
  <div
    ref="el"
    class="draggable prevent-select rounded-xl border bg-card text-card-foreground shadow"
    :style="{
      top: transformedY + 'px',
      left: transformedX + 'px',
      userSelect: isDragging ? 'none' : 'auto',
      zIndex: isDragging ? 4 : 3,
    }"
    :class="[selectedNode?.value?.id === node.id ? 'draggable--outline' : null]"
    style="position: absolute; min-height: 100px; min-width: 100px"
    @click="() => emits('click', node)"
  >
    <div
      class="draggable__header rounded-t-sm border-b flex justify-between items-center"
      @pointerdown.stop="handlePointerDown"
    >
      <div>
        {{ node.type }}
      </div>
      <Popover modal>
        <PopoverTrigger as-child>
          <Settings
            class="cursor-pointer"
            :size="14"
          ></Settings>
        </PopoverTrigger>
        <PopoverContent class="w-50 p-2">
          <div class="flex items-center space-x-2 pb-2">
            <Checkbox
              v-model="isStatement"
              :id="`is-statement-${node.id}`"
            ></Checkbox>
            <label
              :for="`is-statement-${node.id}`"
              class="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Node has own variable name
            </label>
          </div>
          <Label
            class="text-xs"
            :class="[!isStatement && 'opacity-50']"
            >Variable name</Label
          >
          <NodeInput
            v-model="variableName"
            :disabled="!isStatement"
          ></NodeInput>

          <Label
            class="text-xs"
            :class="[!isStatement && 'opacity-50']"
            >Custom code after statement</Label
          >
          <Textarea
            v-model="node.customCode"
            :disabled="!isStatement"
          />
        </PopoverContent>
      </Popover>
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
        class="input-point"
        @click="
          () =>
            handlePinClick(p, {
              x,
              y,
            })
        "
        v-prevent-pointer-movement
      >
        <div
          style="position: absolute; left: 11px; top: -2px; font-size: 10px; font-weight: bolder"
        >
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
        <div class="output-point">
          {{ outputPoint.type }}
        </div>
      </div>
    </div>
    <div
      class="p-2"
      v-prevent-pointer-movement
    >
      <component
        :is="ShaderGraphNodes[node.type]"
        :node="node"
        @updateNode="handleNodeOptionChanged"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ShaderGraphNodes } from './ShaderGraphNodes/ShaderGraphNodes'
import { vPreventPointerMovement } from './utils/PreventPointerDirectiveMove'
import { injectShaderGraphController } from './useShaderGraphController'
import { Settings } from 'lucide-vue-next'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import NodeInput from './ShaderGraphNodes/UI/NodeInput.vue'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

const el = ref(null)

const shaderGraphStore = injectShaderGraphController()

const { originPoint, selectedNode } = shaderGraphStore

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

const variableName = ref(props.node.variableName)
const isStatement = ref(!!props.node.variableName) // node must be statement to have own variable name
const customCode = ref(props.node.customCode)

watch(isStatement, (val) => {
  if (!val) {
    emits('updateNode', props.node.id, {
      variableName: undefined,
    })
    variableName.value = undefined
  } else if (!props.node.variableName) {
    variableName.value = props.node.id
  }
})

watch(variableName, (v) => {
  if (v !== undefined) {
    emits('updateNode', props.node.id, {
      variableName: v,
    })
  }
})

watch(customCode, (v) => {
  if (v !== undefined) {
    emits('updateNode', props.node.id, {
      customCode: v,
    })
  }
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

.draggable--outline {
  outline: 2px solid blue;
}

.draggable__header {
  cursor: move;
  z-index: 2;
  font-weight: bolder;
  padding-left: 6px;
  padding-right: 6px;
  font-size: 12px;
}

.output-point {
  position: absolute;
  right: 11px;
  top: -2px;
  text-align: right;
  font-size: 10px;
  font-weight: bolder;
}

.input-point {
  position: absolute;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background-color: blue;
}
</style>
