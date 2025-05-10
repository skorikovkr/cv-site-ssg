<template>
  <Menubar class="rounded-none border-t-0 border-l-0">
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <span>Open</span>
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

const showAbout = ref(false)
</script>
