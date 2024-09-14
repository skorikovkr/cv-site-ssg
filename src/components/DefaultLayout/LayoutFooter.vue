<script lang="ts" setup>
import { ref } from 'vue'
import PrimeDialog from 'primevue/dialog'

const isTelegramDialogVisible = ref(false);

</script>

<template>
    <footer>
        <PrimeDialog v-model:visible="isTelegramDialogVisible" modal header="My telegram" :style="{ width: '15rem' }">
            <span class="p-text-secondary block mb-5">@skorikovkr</span>
        </PrimeDialog>
        <div class="mt-16 flex flex-col items-center">
            <address class="mb-3 flex space-x-4">
                <a href="https://github.com/skorikovkr" target="_blank" class="dark:text-white fill-current">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path
                            d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.6,5,2.5,9.3,6.9,10.7v-2.3c0,0-0.4,0.1-0.9,0.1c-1.4,0-2-1.2-2.1-1.9 c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1c0.4,0,0.7-0.1,0.9-0.2 c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6c0,0,1.4,0,2.8,1.3 C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3 c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v3.3c4.1-1.3,7-5.1,7-9.5C22,6.1,16.9,1.4,10.9,2.1z" />
                    </svg>
                </a>
                <button @click="isTelegramDialogVisible = true" class="dark:text-white fill-current">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" fill="currentColor" width="25" height="25"
                        viewBox="0 0 50 50">
                        <path
                            d="M25,2c12.703,0,23,10.297,23,23S37.703,48,25,48S2,37.703,2,25S12.297,2,25,2z M32.934,34.375	c0.423-1.298,2.405-14.234,2.65-16.783c0.074-0.772-0.17-1.285-0.648-1.514c-0.578-0.278-1.434-0.139-2.427,0.219	c-1.362,0.491-18.774,7.884-19.78,8.312c-0.954,0.405-1.856,0.847-1.856,1.487c0,0.45,0.267,0.703,1.003,0.966	c0.766,0.273,2.695,0.858,3.834,1.172c1.097,0.303,2.346,0.04,3.046-0.395c0.742-0.461,9.305-6.191,9.92-6.693	c0.614-0.502,1.104,0.141,0.602,0.644c-0.502,0.502-6.38,6.207-7.155,6.997c-0.941,0.959-0.273,1.953,0.358,2.351	c0.721,0.454,5.906,3.932,6.687,4.49c0.781,0.558,1.573,0.811,2.298,0.811C32.191,36.439,32.573,35.484,32.934,34.375z" />
                    </svg>
                </button>
            </address>
            <div class="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div>Skorikov Kirill, 2024</div>
            </div>
        </div>
    </footer>
</template>

<style></style>