export const NodeTypesMap = new Map()

const MathSimilarOverloads = {
  inputs: [
    ['vec2', 'vec2'],
    ['vec3', 'vec3'],
    ['vec4', 'vec4'],
    ['float', 'float'],
    ['vec2', 'float'],
    ['vec3', 'float'],
    ['vec4', 'float'],
    ['float', 'vec2'],
    ['float', 'vec3'],
    ['float', 'vec4'],
  ],
  outputs: [
    ['vec2'],
    ['vec3'],
    ['vec4'],
    ['float'],
    ['vec2'],
    ['vec3'],
    ['vec4'],
    ['vec2'],
    ['vec3'],
    ['vec4'],
  ],
}

NodeTypesMap.set('divide', {
  inputs: MathSimilarOverloads.inputs,
  dataTypes: MathSimilarOverloads.outputs,
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `(${innerExpressions[0]}/${innerExpressions[1]})`
  },
})

NodeTypesMap.set('multiply', {
  inputs: MathSimilarOverloads.inputs,
  dataTypes: MathSimilarOverloads.outputs,
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `(${innerExpressions[0]}*${innerExpressions[1]})`
  },
})

NodeTypesMap.set('add', {
  inputs: MathSimilarOverloads.inputs,
  dataTypes: MathSimilarOverloads.outputs,
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `(${innerExpressions[0]}+${innerExpressions[1]})`
  },
})

NodeTypesMap.set('subtract', {
  inputs: MathSimilarOverloads.inputs,
  dataTypes: MathSimilarOverloads.outputs,
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `(${innerExpressions[0]}-${innerExpressions[1]})`
  },
})

NodeTypesMap.set('const', {
  inputs: [['vec2'], ['vec3'], ['vec4'], ['float']],
  dataTypes: [['vec2'], ['vec3'], ['vec4'], ['float']],
  stringify: (_, innerExpressions) => {
    return `${innerExpressions[0]}`
  },
})

NodeTypesMap.set('value', {
  inputs: null,
  dataTypes: [['float'], ['vec2'], ['vec3'], ['vec4']],
  options: ['value'],
  defaultOptions: ['0.'],
  preferExpression: true,
  stringify: (node) => {
    return `${node.options.value}`
  },
})

NodeTypesMap.set('uniform', {
  inputs: null,
  dataTypes: [['float'], ['vec2'], ['vec3'], ['vec4']],
  options: ['uniformName'],
  defaultOptions: ['u_time'],
  preferExpression: true,
  stringify: (node) => {
    return `${node.options.uniformName}`
  },
})

NodeTypesMap.set('extractor', {
  inputs: [['vec2']],
  dataTypes: [['float']],
  options: ['propertyName'],
  defaultOptions: ['x'],
  preferExpression: true,
  stringify: (node, innerExpressions) => {
    return `(${innerExpressions[0]}.${node.options.propertyName})`
  },
})

NodeTypesMap.set('vec4', {
  inputs: [['float', 'float', 'float', 'float']],
  dataTypes: [['vec4']],
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `vec4(${innerExpressions[0]},${innerExpressions[1]},${innerExpressions[2]},${innerExpressions[3]})`
  },
})

NodeTypesMap.set('vec3', {
  inputs: [['float', 'float', 'float']],
  dataTypes: [['vec3']],
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `vec3(${innerExpressions[0]},${innerExpressions[1]},${innerExpressions[2]})`
  },
})

NodeTypesMap.set('vec2', {
  inputs: [['float', 'float']],
  dataTypes: [['vec2']],
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `vec2(${innerExpressions[0]},${innerExpressions[1]})`
  },
})

NodeTypesMap.set('smoothstep', {
  inputs: [['float', 'float', 'float']],
  dataTypes: [['float']],
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `smoothstep(${innerExpressions[0]},${innerExpressions[1]},${innerExpressions[2]})`
  },
})

NodeTypesMap.set('pow', {
  inputs: [['float', 'float']],
  dataTypes: [['float']],
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `pow(${innerExpressions[0]},${innerExpressions[1]})`
  },
})

NodeTypesMap.set('clamp', {
  inputs: [
    ['float', 'float', 'float'],
    ['vec3', 'float', 'float'],
  ],
  dataTypes: [['float'], ['vec3']],
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `clamp(${innerExpressions[0]},${innerExpressions[1]},${innerExpressions[2]})`
  },
})

NodeTypesMap.set('abs', {
  inputs: [['float'], ['vec3']],
  dataTypes: [['float'], ['vec3']],
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `abs(${innerExpressions[0]})`
  },
})

NodeTypesMap.set('mod', {
  inputs: [
    ['float', 'float'],
    ['vec3', 'float'],
  ],
  dataTypes: [['float'], ['vec3']],
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `mod(${innerExpressions[0]},${innerExpressions[1]})`
  },
})

NodeTypesMap.set('mix', {
  inputs: [['vec3', 'vec3', 'float']],
  dataTypes: [['vec3']],
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `mod(${innerExpressions[0]},${innerExpressions[1]})`
  },
})

NodeTypesMap.set('atan', {
  inputs: [['float', 'float']],
  dataTypes: [['float']],
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `atan(${innerExpressions[0]},${innerExpressions[1]})`
  },
})

NodeTypesMap.set('length', {
  inputs: [['vec2', 'vec3']],
  dataTypes: [['float']],
  preferExpression: true,
  stringify: (_, innerExpressions) => {
    return `length(${innerExpressions[0]})`
  },
})

NodeTypesMap.set('function-invoke', {
  inputs: (functionDefinitionNode) => functionDefinitionNode.inputTypes,
  dataTypes: [[(functionDefinitionNode) => functionDefinitionNode.output]],
  options: ['id'],
  preferExpression: true,
  defaultOptions: [null],
  stringify: (node, innerExpressions) => {
    return `${node.options.id}(${innerExpressions.join(',')})`
  },
})

NodeTypesMap.set('function-return', {
  inputs: (functionDefinitionNode) => functionDefinitionNode.output,
  dataTypes: null,
  stringify: (_, innerExpressions) => {
    return `${innerExpressions[0]}`
  },
})

NodeTypesMap.set('function-arg', {
  inputs: null,
  dataTypes: (functionDefinitionNode) => functionDefinitionNode.inputTypes.map((i) => [i]),
  options: ['name'],
  preferExpression: true,
  defaultOptions: [null],
  stringify: (node) => {
    return `${node.options.name}`
  },
})

NodeTypesMap.set('custom-node', {
  inputs: (definition) => definition.inputTypes,
  dataTypes: [[(definition) => definition.output]],
  options: ['functionName'],
  preferExpression: true,
  defaultOptions: [null],
  stringify: (node, innerExpressions) => {
    return `${node.options.functionName}(${innerExpressions.join(',')})`
  },
})
