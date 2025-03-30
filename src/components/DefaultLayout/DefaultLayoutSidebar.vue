<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
} from '@/components/ui/sidebar'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SquareTerminal, Home, ChevronRight } from 'lucide-vue-next'
import DefaultLayoutSidebarHeader from './DefaultLayoutSiedbarHeader.vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import ColorModePicker from '../ColorModePicker.vue'

const navLinks = ref([
  {
    title: 'Projects',
    icon: SquareTerminal,
    items: [
      { title: 'Color correction', routeName: 'ColorCorrection' },
      { title: 'Metronome', routeName: 'Metronome' },
    ],
  },
])
</script>
<template>
  <Sidebar>
    <SidebarHeader>
      <DefaultLayoutSidebarHeader />
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Home"
              as-child
            >
              <RouterLink :to="{ name: 'Home' }">
                <Home />
                <span>Home</span>
              </RouterLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <Collapsible
            v-for="item in navLinks"
            :key="item.title"
            as-child
            :default-open="true"
            class="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger as-child>
                <SidebarMenuButton :tooltip="item.title">
                  <component
                    :is="item.icon"
                    v-if="item.icon"
                  />
                  <span>{{ item.title }}</span>
                  <ChevronRight
                    class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem
                    v-for="subItem in item.items"
                    :key="subItem.title"
                  >
                    <SidebarMenuSubButton as-child>
                      <RouterLink :to="{ name: subItem.routeName }">
                        <span>{{ subItem.title }}</span>
                      </RouterLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <ColorModePicker />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
