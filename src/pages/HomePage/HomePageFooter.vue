<script lang="ts" setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import TelegramIcon from '@/components/icons/TelegramIcon.vue'
import GitHubIcon from '@/components/icons/GitHubIcon.vue'

const isTelegramDialogVisible = ref(false)
</script>

<template>
  <footer>
    <div
      class="mt-16 flex flex-col items-center"
      id="contacts"
    >
      <address class="mb-3 flex space-x-4">
        <p>Contact me:</p>
        <a
          href="https://github.com/skorikovkr"
          target="_blank"
          class="dark:text-primary fill-current"
        >
          <GitHubIcon :size="25" />
        </a>
        <Dialog>
          <DialogTrigger>
            <button
              @click="isTelegramDialogVisible = true"
              class="dark:text-primary fill-current"
            >
              <TelegramIcon :size="25" />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>My telegram</DialogTitle>
              <DialogDescription>
                <span>@skorikovkr</span>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </address>
      <div class="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <div>Skorikov Kirill, 2025</div>
      </div>
    </div>
  </footer>
</template>

<style></style>
