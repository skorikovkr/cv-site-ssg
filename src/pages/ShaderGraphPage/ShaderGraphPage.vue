<script setup lang="ts">
import Separator from '@/components/ui/separator/Separator.vue'
import DraggableElementsTable from './DraggableElementsTable.vue'
import ShaderGraphMenubar from './ShaderGraphMenubar.vue'
import { Button } from '@/components/ui/button'
import { Blocks, FunctionSquare, Plus, Spline, Terminal, X } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { computed, ref } from 'vue'
import { functions as funcs, coords } from './examples/test'
import { provideShaderGraphController } from './useShaderGraphController'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const shaderGraph = provideShaderGraphController()
shaderGraph.init(funcs, coords)

const showCode = ref(false)
const showFunctionCreation = ref(false)
const showNodeCreation = ref(false)

const handleDeleteWireClick = () => {
  shaderGraph.deleteWire(shaderGraph.selectedWire.value)
  shaderGraph.selectedWire.value = null
}

const handleDeleteNodeClick = () => {
  shaderGraph.deleteNode(shaderGraph.selectedNode.value)
  shaderGraph.selectedNode.value = null
}

function handleAddFunction() {
  const id = shaderGraph.addFunction(shaderGraph.newFunction.value)
  showFunctionCreation.value = false
  shaderGraph.resetNewFunction()
  shaderGraph.currentFunctionId.value = id
}

const handleNewNodeChange = (nodeTypeName) => {
  shaderGraph.addNode(nodeTypeName)
}

const functionsKeys = computed(() => Object.keys(shaderGraph.functions.value))

const allowedTypes = ['float', 'vec2', 'vec3', 'vec4']
</script>

<template>
  <div class="shader-graph__work-view">
    <ShaderGraphMenubar />
    <div class="p-1 flex gap-1 items-center">
      <Select v-model:model-value="shaderGraph.currentFunctionId.value">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Select function" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Functions</SelectLabel>
            <SelectItem
              v-for="key in functionsKeys"
              :key="key"
              :value="key"
            >
              {{ shaderGraph.functions.value[key]?.name ?? key }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        class="relative w-10"
        @click="showFunctionCreation = true"
      >
        <FunctionSquare class="absolute left-1" />
        <Plus class="absolute left-5 bottom-1" />
      </Button>
      <Button
        variant="ghost"
        class="relative w-10"
        @click="showNodeCreation = true"
      >
        <Blocks class="absolute left-1" />
        <Plus class="absolute left-5 bottom-1" />
      </Button>
      <Separator
        orientation="vertical"
        class="h-6"
      />
      <Button
        variant="ghost"
        class="relative"
        :disabled="!shaderGraph.selectedNode.value"
        @click="handleDeleteNodeClick"
      >
        <Blocks />
        <X
          class="absolute right-1 bottom-1"
          color="red"
        />
      </Button>
      <Button
        variant="ghost"
        class="relative"
        :disabled="!shaderGraph.selectedWire.value"
        @click="handleDeleteWireClick"
      >
        <Spline />
        <X
          class="absolute right-1 bottom-1"
          color="red"
        />
      </Button>
      <Separator
        orientation="vertical"
        class="h-6"
      />
      <Button
        variant="ghost"
        @click="showCode = true"
      >
        <Terminal />
      </Button>
    </div>
    <div class="shader-graph__canvas">
      <DraggableElementsTable> </DraggableElementsTable>
    </div>
    <Dialog v-model:open="showCode">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Shader code</DialogTitle>
          <DialogDescription class="text-primary">
            <Tabs default-value="code">
              <TabsList>
                <TabsTrigger value="code"> Code </TabsTrigger>
                <TabsTrigger value="graph-data"> Graph data </TabsTrigger>
              </TabsList>
              <TabsContent value="code">
                <pre
                  class="whitespace-break-spaces h-[500px] max-h-[500px] overflow-y-auto text-start"
                  >{{ shaderGraph.result.value.result }}</pre
                >
              </TabsContent>
              <TabsContent value="graph-data">
                <pre
                  class="whitespace-break-spaces h-[500px] max-h-[500px] overflow-y-auto text-start"
                  >{{ shaderGraph.functions.value }}</pre
                >
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showFunctionCreation">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create function</DialogTitle>
        </DialogHeader>
        <div class="flex-col">
          <div class="flex-col gap-2 mb-2">
            <div>
              <Label for="function-name">Name</Label>
              <Input
                id="function-name"
                type="text"
                placeholder="Name"
                :model-value="shaderGraph.newFunction.value?.name"
                @update:model-value="(p) => (shaderGraph.newFunction.value.name = p)"
              />
            </div>
            <div>
              <Label for="function-Output">Output</Label>
              <Select
                :model-value="shaderGraph.newFunction.value?.output"
                @update:model-value="(v) => (shaderGraph.newFunction.value.output = v)"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Output" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="type in allowedTypes"
                      :key="type"
                      :value="type"
                    >
                      {{ type }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button @click="handleAddFunction">Create</Button>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showNodeCreation">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create node</DialogTitle>
        </DialogHeader>
        <div>
          <input @change="(e) => handleNewNodeChange(e.target.value)" />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped></style>
