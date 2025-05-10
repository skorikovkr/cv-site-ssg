<script setup>
import Separator from '@/components/ui/separator/Separator.vue'
import DraggableElementsTable from './DraggableElementsTable.vue'
import ShaderGraphMenubar from './ShaderGraphMenubar.vue'
import { useShaderGraphStore } from './ShaderGraphStore'
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
import { storeToRefs } from 'pinia'
import { functions as funcs, coords } from './examples/test'

const shaderGraphStore = useShaderGraphStore()
shaderGraphStore.init(funcs, coords)

const showCode = ref(false)
const showFunctionCreation = ref(false)
const showNodeCreation = ref(false)

const handleDeleteWireClick = () => {
  shaderGraphStore.deleteWire(shaderGraphStore.selectedWire)
  shaderGraphStore.selectedWire = null
}

const handleDeleteNodeClick = () => {
  shaderGraphStore.deleteNode(shaderGraphStore.selectedNode)
  shaderGraphStore.selectedNode = null
}

function handleAddFunction() {
  shaderGraphStore.addFunction(newFunction.value)
  shaderGraphStore.resetNewFunction()
}

const handleNewNodeChange = (nodeTypeName) => {
  shaderGraphStore.addNode(nodeTypeName)
}

const { currentFunctionId, functions, newFunction } = storeToRefs(shaderGraphStore)

const functionsKeys = computed(() => Object.keys(functions.value))
</script>

<template>
  <div class="shader-graph__work-view">
    <ShaderGraphMenubar />
    <div class="p-1 flex gap-1 items-center">
      <Select v-model:model-value="currentFunctionId">
        <SelectTrigger class="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Functions</SelectLabel>
            <SelectItem
              v-for="key in functionsKeys"
              :key="key"
              :value="key"
            >
              {{ functions[key]?.name ?? key }}
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
        :disabled="!shaderGraphStore.selectedNode"
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
        :disabled="!shaderGraphStore.selectedWire"
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
            <pre class="whitespace-break-spaces max-h-[500px] overflow-y-auto text-start">{{
              shaderGraphStore.result.result
            }}</pre>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showFunctionCreation">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create function</DialogTitle>
        </DialogHeader>
        <div>
          <div>
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
