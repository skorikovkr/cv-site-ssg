<script setup>
import LayoutFooter from './LayoutFooter.vue';
import LayoutHeader from './LayoutHeader.vue';
</script>

<template>
    <div class="bg-white text-black antialiased dark:bg-gray-950 dark:text-white">
        <section class="mx-auto max-w-3xl h-full px-4 sm:px-6 xl:max-w-5xl xl:px-0">
            <div class="flex min-h-screen flex-col justify-between font-sans">
                <LayoutHeader />
                <slot></slot>
                <LayoutFooter class="mt-5" />
            </div>
        </section>
    </div>
</template>

<style scoped></style>
