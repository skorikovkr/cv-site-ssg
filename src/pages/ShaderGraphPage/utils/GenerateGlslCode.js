import { NodeTypesMap } from './NodeTypesMap'

function GenerateFunctionCode(f) {
  let result = ''
  const alreadyDefinedVars = new Set()
  const numberOfNodeUsages = new Map()
  let uniforms = {}
  let errors = []
  const requiredFunctions = []

  Object.values(f.nodes).forEach((v) => {
    v.inputs?.forEach((i) => {
      const n = numberOfNodeUsages.get(i)
      if (n === undefined) {
        numberOfNodeUsages.set(i, 1)
      } else {
        numberOfNodeUsages.set(i, n + 1)
      }
    })
  })
  function GenerateExpressionsAndStatements(node, parentNode, argIndex) {
    if (!node) {
      errors.push({
        function: f.id,
        parentNode: parentNode.id,
        index: argIndex,
      })
      return 'NULL'
    }
    if (node.type === 'uniform') {
      uniforms[node.options.uniformName] = node.dataType
      return node.options.uniformName
    }
    if (node.type === 'function-arg') {
      return node.options.name
    }
    if (node.type === 'function-invoke') {
      requiredFunctions.push(node.options.id)
    }
    const nodeType = NodeTypesMap.get(node.type)
    if (alreadyDefinedVars.has(node.variableName ?? node.id)) {
      return node.variableName ?? node.id
    }
    const isExpression =
      !node.variableName &&
      (node.type === 'value' ||
        (nodeType.preferExpression && numberOfNodeUsages.get(node.variableName ?? node.id) < 2))
    const part = nodeType.stringify(
      node,
      node.inputTypes?.map((_, i) =>
        GenerateExpressionsAndStatements(f.nodes[node.inputs[i]], node, i),
      ) ?? [],
    )
    if (isExpression) {
      return part
    } else {
      alreadyDefinedVars.add(node.variableName ?? node.id)
      // why r2?
      // += operator can overlap with other recursions
      //('result = result + r2', 'result' remains the same as in first recursion depth and erases future concatenations)
      let dataType = ''
      let nodeId = node.variableName ?? node.id
      let r2 = ''
      if (node.type !== 'function-return') {
        dataType = node.dataType
        if (node.type === 'const') {
          dataType = 'const ' + dataType
        }
      }
      if (dataType) dataType += ' '
      if (node.type === 'function-return') {
        if (f.name === 'main') {
          r2 = `gl_FragColor=` + part + ';\n'
        } else {
          r2 = `return ` + part + ';\n'
        }
      } else {
        r2 = `${dataType}${nodeId}=` + part + ';\n'
        if (node.type !== 'function-return' && node.variableName) {
          let code = node.customCode
          if (code[code.length - 1] === '\n') code = code.substring(0, code.length)
          if (code[code.length - 1] !== ';') code += ';'
          r2 += code + '\n'
        }
      }
      result += '\t' + r2
      return nodeId
    }
  }

  GenerateExpressionsAndStatements(f.nodes.root)

  result = result.substring(0, result.length - 1)
  return {
    code: result,
    errors,
    uniforms,
    requiredFunctions,
  }
}

export function GenerateGlslCode(
  rootFunction,
  functions,
  options = {
    precision: 'mediump',
  },
) {
  let uniforms = {}
  let errors = []
  let requiredFunctions = []
  let functionsDefinitions = ''
  let alreadyDefinedFunctions = new Set(['main'])

  const {
    uniforms: u,
    errors: e,
    code: c,
    requiredFunctions: rf,
  } = GenerateFunctionCode(rootFunction)
  uniforms = {
    ...uniforms,
    ...u,
  }
  errors = [...errors, ...e]
  const code = c
  requiredFunctions = rf

  while (requiredFunctions.length > 0) {
    const funcId = requiredFunctions.pop()
    const func = functions[funcId]
    alreadyDefinedFunctions.add(funcId)
    const { uniforms: u, errors: e, code: c, requiredFunctions: rf } = GenerateFunctionCode(func)
    uniforms = {
      ...uniforms,
      ...u,
    }
    errors = [...errors, ...e]
    const args = (func.inputTypes ?? []).map((it, index) => `in ${it} ${func.inputsNames?.[index]}`)
    functionsDefinitions =
      `${func.output} ${func.id}(${args}) {
  ${c}
}` + functionsDefinitions
    requiredFunctions = rf.filter((f) => !alreadyDefinedFunctions.has(f))
  }

  const uniformsInitialization = Object.keys(uniforms)
    .map((u) => `uniform ${uniforms[u]} ${u};`)
    .join('\n')

  const result = `#ifdef GL_ES
precision ${options.precision} float;
#endif

${uniformsInitialization}
${functionsDefinitions}

void main() {
${code}
}`

  return {
    result,
    errors,
  }
}
