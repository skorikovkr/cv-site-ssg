import HomePage from './pages/HomePage/HomePage.vue'
import ColorCorrectorPage from './pages/ColorCorrectionPage/ColorCorrectorPage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/color-correction', component: ColorCorrectorPage }
]
const options = {
  routes
}

export { options }
