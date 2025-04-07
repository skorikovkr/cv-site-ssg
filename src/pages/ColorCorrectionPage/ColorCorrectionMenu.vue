<template>
  <Menubar class="rounded-none border-t-0 border-l-0">
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem @select="handleFileSelectClick">
          <label for="color-correction__uploadInput">
            <span>Open</span>
          </label>
          <input
            ref="uploadFile"
            class="hidden"
            id="color-correction__uploadInput"
            type="file"
            name="color-correction__uploadInput"
            accept="image/*"
            @change="onFileChange"
          />
        </MenubarItem>

        <MenubarSub>
          <MenubarSubTrigger>Export as</MenubarSubTrigger>
          <MenubarSubContent>
            <MenubarItem @select="handleSaveImage('jpeg')"> .jpeg </MenubarItem>
            <MenubarItem @select="handleSaveImage('png')"> .png </MenubarItem>
          </MenubarSubContent>
        </MenubarSub>
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
          <p>This is web application for color correction.</p>
          <p>Create and move <i>dots</i> to change image's colors.</p>
          <p class="mb-4">
            Use <i>mouse scroll</i> to zoom image and <i>left mouse button</i> to move.
          </p>
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
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from '@/components/ui/menubar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useColorCorrectionStore } from './ColorCorrectionStore'
import { ref } from 'vue'

const colorCorrectionStore = useColorCorrectionStore()

const uploadFile = ref()
const showAbout = ref(false)

const onFileChange = (e) => {
  const file = e.target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    colorCorrectionStore.file = file
  }
}

function handleFileSelectClick() {
  if (uploadFile.value) {
    uploadFile.value.click()
  }
}

function handleSaveImage(extension) {
  const dataURL = colorCorrectionStore.imageCanvas.toDataURL(`image/${extension}`, 1.0)
  const a = document.createElement('a')
  a.href = dataURL
  a.download = `untitled.${extension}`
  document.body.appendChild(a)
  a.click()
  //a.remove()
}
</script>
