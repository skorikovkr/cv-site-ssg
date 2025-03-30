import './assets/main.css'

import { createPinia } from 'pinia'
import routes from './router/routes'
import { ViteSSG } from 'vite-ssg'

import App from './App.vue'
import { useRootStore } from './stores/RootStore'

export const createApp = ViteSSG(App, { routes }, ({ app, router, initialState }) => {
  const pinia = createPinia()
  app.use(pinia)

  if (import.meta.env.SSR) initialState.pinia = pinia.state.value
  else pinia.state.value = initialState.pinia || {}

  router.beforeEach(() => {
    const store = useRootStore(pinia)
    if (!store.ready) store.initialize()
  })
})
