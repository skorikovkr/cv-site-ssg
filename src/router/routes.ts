import HomePage from '@/pages/HomePage/HomePage.vue'
import ColorCorrectorPage from '@/pages/ColorCorrectionPage/ColorCorrectorPage.vue'
import MetronomePage from '@/pages/MetronomePage/MetronomePage.vue'
import type { RouteRecordRaw } from 'vue-router'
import ProjectLayout from '@/components/ProjectLayout.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: HomePage, meta: { breadcrumbs: ['Home'] } },
  {
    path: '/color-correction',
    name: 'ColorCorrection',
    component: ColorCorrectorPage,
    meta: { breadcrumbs: ['Projects', 'Color correction app'], layout: ProjectLayout },
  },
  {
    path: '/metronome',
    name: 'Metronome',
    component: MetronomePage,
    meta: { breadcrumbs: ['Projects', 'Metronome app'] },
  },
]

export default routes
