<script setup lang="ts">
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
import { SquareTerminal, Home, ChevronRight, Contact } from 'lucide-vue-next'
import DefaultLayoutSidebarHeader from './DefaultLayoutSiedbarHeader.vue'
import { ref, shallowRef } from 'vue'
import { RouterLink } from 'vue-router'
import ColorModePicker from '../ColorModePicker.vue'
import TelegramIcon from '../icons/TelegramIcon.vue'
import GitHubIcon from '../icons/GitHubIcon.vue'
import SteamIcon from '../icons/SteamIcon.vue'

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

const contacts = shallowRef([
  {
    title: 'Projects',
    icon: Contact,
    items: [
      { title: 'Telegram', href: 'https://t.me/skorikovkr', icon: TelegramIcon },
      { title: 'GitHub', href: 'https://github.com/skorikovkr', icon: GitHubIcon },
      { title: 'Steam', href: 'https://steamcommunity.com/id/batiatrus', icon: SteamIcon },
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

      <SidebarGroup>
        <SidebarGroupLabel>Contacts</SidebarGroupLabel>
        <SidebarMenu>
          <Collapsible
            v-for="item in contacts"
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
                      <a
                        target="_blank"
                        :href="subItem.href"
                      >
                        <component
                          :is="subItem.icon"
                          v-if="subItem.icon"
                          :size="16"
                        />
                        <span>{{ subItem.title }}</span>
                      </a>
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
