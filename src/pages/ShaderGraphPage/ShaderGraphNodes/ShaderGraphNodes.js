import UniformNode from './UniformNode.vue'
import ValueNode from './ValueNode.vue'
import FunctionInvokeNode from './FunctionInvokeNode.vue'
import CustomNode from './CustomNode.vue'
import ExtractorNode from './ExtractorNode.vue'
import FunctionArgNode from './FunctionArgNode.vue'

export const ShaderGraphNodes = {
  value: ValueNode,
  uniform: UniformNode,
  'function-invoke': FunctionInvokeNode,
  'custom-node': CustomNode,
  extractor: ExtractorNode,
  'function-arg': FunctionArgNode,
}
