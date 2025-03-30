<script setup lang="ts">
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const { toggleSidebar } = useSidebar()
</script>
<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        data-sidebar="trigger"
        variant="ghost"
        @click="toggleSidebar"
      >
        <div
          class="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground"
        >
          <img
            alt="skorikovkr site logo"
            src="/favicon.ico"
            class="size-7"
          />
        </div>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-semibold">skorikovkr</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
