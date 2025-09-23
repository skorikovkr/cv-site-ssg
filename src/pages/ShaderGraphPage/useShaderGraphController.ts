import { computed, inject, provide, ref, toValue, type InjectionKey } from 'vue'
import { getRandInt } from './utils/GetRandInt'
import { NodeTypesMap } from './utils/NodeTypesMap'
import { GenerateGlslCode } from './utils/GenerateGlslCode'

export function useShaderGraphController() {
  const originPoint = ref({
    x: 0,
    y: 0,
  })
  const isPanning = ref(false)
  const cursorX = ref(0)
  const cursorY = ref(0)
  const functions = ref(null)
  const nodesCoords = ref(null)
  const currentFunctionId = ref('main')
  const newFunction = ref<{
    id: null | string
    name: string
    inputTypes: string[]
    inputsNames: string[]
    output: string | null
  }>()
  const newWire = ref(null)
  const wires = ref([])
  const selectedWire = ref(null)
  const selectedNode = ref(null)

  resetNewFunction()

  function init(fns, coords) {
    originPoint.value = {
      x: 0,
      y: 0,
    }
    isPanning.value = false
    cursorX.value = 0
    cursorY.value = 0
    functions.value = fns
    nodesCoords.value = coords
    newWire.value = null
    resetNewFunction()
    currentFunctionId.value = 'main'
    wires.value = []
    selectedWire.value = null
    selectedNode.value = null
  }

  function addFunction(func) {
    let id = `function${getRandInt(0, 999999)}`
    while (Object.keys(functions.value).find((k) => k === id)) {
      id = `function${getRandInt(0, 999999)}`
    }
    const funcDefinition = toValue(func)
    newFunction.value.id = id
    functions.value[id] = {
      ...funcDefinition,
      nodes: {},
    }
    nodesCoords.value[id] = {
      nodes: {},
    }
    addNode('function-return', id, {
      inputs: [[funcDefinition.output]],
    })
    return id
  }

  function resetNewFunction() {
    newFunction.value = {
      id: null,
      name: '',
      inputTypes: [],
      inputsNames: [],
      output: null,
    }
  }

  function updateWires(nodeId) {
    const existingWireIndex = wires.value.findIndex((w) => w.id === nodeId)
    const coords = nodesCoords.value[currentFunctionId.value].nodes[nodeId]
    if (existingWireIndex !== -1) {
      if (!functions.value[currentFunctionId.value].nodes[nodeId]) {
        wires.value.splice(existingWireIndex, 1)
        return
      }
      wires.value[existingWireIndex] = {
        id: nodeId,
        starts: functions.value[currentFunctionId.value].nodes[nodeId].inputs?.map((i) => {
          return i
            ? {
                id: i,
                x: nodesCoords.value[currentFunctionId.value].nodes[i]?.x ?? 0,
                y: nodesCoords.value[currentFunctionId.value].nodes[i]?.y ?? 0,
                width: nodesCoords.value[currentFunctionId.value].nodes[i]?.width ?? 100,
              }
            : null
        }),
        end: {
          id: nodeId,
          x: coords?.x ?? 0,
          y: coords?.y ?? 0,
        },
      }
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

  function updateAllWires() {
    Object.keys(functions.value[currentFunctionId.value].nodes).forEach((n) => {
      updateWires(n)
    })
  }

  function addNode(
    nodeTypeName,
    functionId = null,
    defaults = {
      dataType: null,
      inputs: null,
    },
  ) {
    const nodeType = NodeTypesMap.get(nodeTypeName)
    if (nodeType) {
      const name = nodeTypeName + getRandInt(100000, 999999).toString()
      const defaultOptions = {}
      nodeType.options?.forEach((o, index) => {
        defaultOptions[o] = nodeType.defaultOptions[index]
      })
      functions.value[functionId ?? currentFunctionId.value].nodes[name] = {
        type: nodeTypeName,
        dataType: defaults.dataType ?? nodeType.dataTypes?.[0]?.[0] ?? null,
        id: name,
        inputs: (defaults.inputs ?? nodeType.inputs)?.[0]?.map(() => null),
        inputTypes: (defaults.inputs ?? nodeType.inputs)?.[0],
        options: defaultOptions,
      }
      if (!nodesCoords.value[functionId ?? currentFunctionId.value]) {
        nodesCoords.value[functionId ?? currentFunctionId.value] = {
          x: 0,
          y: 0,
          nodes: {},
        }
      }
      nodesCoords.value[functionId ?? currentFunctionId.value].nodes[name] = {
        x: 0,
        y: 0,
      }
    }
  }

  function updateNode(nodeId, nodeConfig) {
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
      // Remode wires on changing datatype?
      // Object.keys(functions.value[currentFunctionId.value].nodes).forEach((k) => {
      //   functions.value[currentFunctionId.value].nodes[k].inputs?.forEach((i, index) => {
      //     if (nodeId === i) {
      //       functions.value[currentFunctionId.value].nodes[k].inputs[index] = null
      //       updateWires(k)
      //     }
      //   })
      // })
    }
    if (nodeConfig.inputTypes) {
      node.inputTypes = nodeConfig.inputTypes
    }
    if (nodeConfig.inputs) {
      node.inputs = nodeConfig.inputs
    }
    node.variableName = nodeConfig.variableName

    updateWires(nodeId)
  }

  function deleteNode(node) {
    const id = node.id
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
  }

  function deleteWire(wire) {
    const nodeKey = Object.keys(functions.value[currentFunctionId.value].nodes).find(
      (k) => k === wire.end,
    )
    if (nodeKey) {
      functions.value[currentFunctionId.value].nodes[nodeKey].inputs[wire.index] = null
      updateWires(wire.end)
    }
  }

  const result = computed(() => {
    const root = functions.value.main
    if (root) {
      console.log('GenerateGlslCode')
      return GenerateGlslCode(toValue(root), toValue(functions), {
        precision: 'mediump',
      })
    } else {
      return null
    }
  })

  return {
    originPoint,
    isPanning,
    cursorX,
    cursorY,
    functions,
    nodesCoords,
    currentFunctionId,
    newFunction,
    newWire,
    /**
     * wires - group of wires which are ending in one point
     */
    wires,
    selectedWire,
    selectedNode,

    result,

    init,
    resetNewFunction,
    addFunction,
    updateWires,
    updateAllWires,
    addNode,
    updateNode,
    deleteNode,
    deleteWire,
  }
}

export const ShaderGraphControllerSymbol = Symbol() as InjectionKey<
  ReturnType<typeof useShaderGraphController>
>

export function provideShaderGraphController(key?: string | typeof ShaderGraphControllerSymbol) {
  const controller = useShaderGraphController()
  provide(key ?? ShaderGraphControllerSymbol, controller)
  return controller
}

export function injectShaderGraphController(key?: string | typeof ShaderGraphControllerSymbol) {
  const controller = inject(key ?? ShaderGraphControllerSymbol)
  if (!controller) {
    throw new Error('ShaderGraphController was not provided.')
  }
  return controller
}
