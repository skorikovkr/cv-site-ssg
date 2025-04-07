<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { SquareTerminal, Home, ChevronRight, Contact } from 'lucide-vue-next'
import DefaultLayoutSidebarHeader from './DefaultLayoutSidebarHeader.vue'
import { ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import ColorModePicker from '../ColorModePicker.vue'
import TelegramIcon from '../icons/TelegramIcon.vue'
import GitHubIcon from '../icons/GitHubIcon.vue'
import SteamIcon from '../icons/SteamIcon.vue'

const router = useRouter()
const { isMobile, setOpenMobile } = useSidebar()

function handleLinkClick(routeName: string) {
  if (isMobile.value) {
    setOpenMobile(false)
  }
  router.push({ name: routeName })
}

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
    title: 'Contacts',
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
              <div
                class="cursor-pointer"
                @click="handleLinkClick('Home')"
              >
                <Home />
                <span>Home</span>
              </div>
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
                      <div
                        class="cursor-pointer"
                        @click="handleLinkClick(subItem.routeName)"
                      >
                        <span>{{ subItem.title }}</span>
                      </div>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

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

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <div class="p-2">
            <ColorModePicker />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
