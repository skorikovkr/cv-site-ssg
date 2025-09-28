<template>
  <Menubar class="rounded-none border-t-0 border-l-0">
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @select="shaderGraph.createEmpty">
          <span>New</span>
        </MenubarItem>
        <MenubarItem @select="handleFileSelectClick">
          <label for="shader-graph__uploadInput">
            <span>Open</span>
          </label>
          <input
            ref="uploadFile"
            class="hidden"
            id="shader-graph__uploadInput"
            type="file"
            name="shader-graph__uploadInput"
            accept="application/json"
            @change="onFileChange"
          />
        </MenubarItem>
        <MenubarItem @select="handleSave">
          <span>Save</span>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Help</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @select="showAbout = true"> About </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
  <Dialog v-model:open="showAbout">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>About</DialogTitle>
        <DialogDescription class="text-primary">
          <p>This is "Shader graph" web application.</p>
          <p>It allows to code shaders with graphic UI and preview the result.</p>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  // MenubarSub,
  // MenubarSubContent,
  // MenubarSubTrigger,
} from '@/components/ui/menubar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ref } from 'vue'
import { injectShaderGraphController } from './useShaderGraphController'
import { saveJSONToFile } from './utils/SaveJsonFile'

const showAbout = ref(false)
const uploadFile = ref()

const shaderGraph = injectShaderGraphController()

function handleSave() {
  saveJSONToFile(
    {
      nodes: shaderGraph.functions.value,
      coords: shaderGraph.nodesCoords.value,
    },
    'shader-graph',
  )
}

function handleFileSelectClick() {
  if (uploadFile.value) {
    uploadFile.value.click()
  }
}

const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()

    reader.onload = (e) => {
      const fileContent = e.target.result
      const data = JSON.parse(fileContent)
      shaderGraph.init(data.nodes, data.coords)
    }

    reader.readAsText(file) // Read the file as text
  }
}
</script>
