<script lang="ts" setup>
import { computed } from 'vue';
import ColorModePicker from '../../components/ColorModePicker.vue';
import MobileNav from '../../components/MobileNav.vue';

const navLinks = computed(() => [
    {
        'href': '/',
        'title': 'Home'
    },
    {
        'href': '/color-correction',
        'title': 'Color-corr'
    }
]);
</script>

<template>
    <header class="flex items-center justify-between py-10">
        <div>
            <a href="/">
                <div class="flex items-center justify-between">
                    <div class="text-xl font-bold">
                        skorikovkr
                    </div>
                </div>
            </a>
        </div>
        <div class="flex items-center space-x-4 leading-5 sm:space-x-6">
            <template v-for="link in navLinks" :key="link.title">
                <RouterLink :to="link.href" class="hidden font-medium text-gray-900 dark:text-gray-100 sm:block">
                    {{ link.title }}
                </RouterLink>
            </template>
            <ClientOnly>
                <div class="control-buttons hidden gap-4 sm:flex">
                    <ColorModePicker />
                </div>
                <MobileNav :nav-links="navLinks" />
            </ClientOnly>
        </div>
    </header>
</template>

<style></style>