import UniformNode from './UniformNode.vue'
import ValueNode from './ValueNode.vue'
import FunctionInvokeNode from './FunctionInvokeNode.vue'

export const ShaderGraphNodes = {
  value: ValueNode,
  uniform: UniformNode,
  'function-invoke': FunctionInvokeNode,
}
