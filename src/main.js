import './assets/main.css'

import { ViteSSG } from 'vite-ssg'
import PrimeVue from 'primevue/config'
import Aura from './presets/aura'
import App from './App.vue'
import { options } from './router'

export const createApp = ViteSSG(App, options, ({ app }) => {
  app.use(PrimeVue, {
    unstyled: true,
    pt: Aura,
    theme: {
      options: {
        darkModeSelector: '.dark'
      }
    }
  })
})
