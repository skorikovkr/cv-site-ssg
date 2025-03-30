import HomePage from '@/pages/HomePage/HomePage.vue'
import ColorCorrectorPage from '@/pages/ColorCorrectionPage/ColorCorrectorPage.vue'
import MetronomePage from '@/pages/MetronomePage/MetronomePage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage, meta: { breadcrumbs: ['Home'] } },
  {
    path: '/color-correction',
    name: 'ColorCorrection',
    component: ColorCorrectorPage,
    meta: { breadcrumbs: ['Projects', 'Color correction app'] },
  },
  {
    path: '/metronome',
    name: 'Metronome',
    component: MetronomePage,
    meta: { breadcrumbs: ['Projects', 'Metronome app'] },
  },
]

export default routes
