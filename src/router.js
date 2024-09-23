import HomePage from './pages/HomePage/HomePage.vue'
import ColorCorrectorPage from './pages/ColorCorrectionPage/ColorCorrectorPage.vue'
import MetronomePage from './pages/MetronomePage/MetronomePage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/color-correction', component: ColorCorrectorPage },
  { path: '/metronome', component: MetronomePage }
]
const options = {
  routes
}

export { options }
