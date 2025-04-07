<script setup>
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import DefaultLayoutSidebar from './DefaultLayoutSidebar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <SidebarProvider>
    <DefaultLayoutSidebar />
    <SidebarInset>
      <header
        class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
      >
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator
            v-if="route.name !== 'Home'"
            orientation="vertical"
            class="mr-2 h-4"
          />
          <Breadcrumb v-if="route.name !== 'Home'">
            <BreadcrumbList>
              <template
                v-for="(crumb, i) in route.meta.breadcrumbs"
                :key="crumb"
              >
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink> {{ route.meta.breadcrumbs[i] }} </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator
                  v-if="i != route.meta.breadcrumbs.length - 1"
                  class="hidden md:block"
                />
              </template>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div>
        <section
          v-if="!route.meta.layout"
          class="mx-auto max-w-3xl h-full px-4 sm:px-6 xl:max-w-5xl xl:px-0"
        >
          <div class="flex flex-col justify-between">
            <slot></slot>
          </div>
        </section>
        <template v-else>
          <component :is="route.meta.layout">
            <slot></slot>
          </component>
        </template>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped></style>
