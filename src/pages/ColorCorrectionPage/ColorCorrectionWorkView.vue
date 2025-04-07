<script setup lang="ts">
import { ref, onMounted, watch, shallowRef, onUnmounted } from 'vue'
import CurveCanvas from './CurveCanvas.vue'
import { evaluateInterpolationAtPoint } from '../../utils/cubicSplineInterpolation'
import ImageCanvas from './ImageCanvas.vue'
import { useColorCorrectionStore } from './ColorCorrectionStore'
import ColorCorrectionMenu from './ColorCorrectionMenu.vue'
import ToggleGroup from '@/components/ui/toggle-group/ToggleGroup.vue'
import ToggleGroupItem from '@/components/ui/toggle-group/ToggleGroupItem.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { Maximize, ZoomIn, ZoomOut } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'

const colorCorrectionStore = useColorCorrectionStore()
const curveCanvas = ref()
const imageCanvas = ref()
const savedImageData = shallowRef(null)
const tempImageData = shallowRef(null)
const colorCount = ref({
  R: Array.from({ length: 256 }, () => 0),
  G: Array.from({ length: 256 }, () => 0),
  B: Array.from({ length: 256 }, () => 0),
  RGB: Array.from({ length: 256 }, () => 0),
  maxR: 0,
  maxG: 0,
  maxB: 0,
  maxRGB: 0,
})
const imageCanvasContainer = ref()
const canvasWidth = ref(500)
const canvasHeight = ref(500)
const resizeObserver = shallowRef(
  new ResizeObserver((entries) => {
    for (const entry of entries) {
      const cr = entry.contentRect
      resizeCanvas(cr.width, cr.height)
    }
  }),
)

function resizeCanvas(newWidth, newHeight) {
  canvasWidth.value = newWidth
  canvasHeight.value = newHeight
}

onMounted(() => {
  imageCanvas.value?.draw(tempImageData.value)
  resizeObserver.value.observe(imageCanvasContainer.value)
})

onUnmounted(() => {
  resizeObserver.value.disconnect()
})

const createColorHist = (data) => {
  const colorCountTemp = {
    R: Array.from({ length: 256 }, () => 0),
    G: Array.from({ length: 256 }, () => 0),
    B: Array.from({ length: 256 }, () => 0),
    RGB: Array.from({ length: 256 }, () => 0),
    maxR: 0,
    maxG: 0,
    maxB: 0,
    maxRGB: 0,
  }
  for (let i = 0; i < data.length; i += 4) {
    colorCountTemp.R[data[i]]++
    if (colorCountTemp.R[data[i]] > colorCountTemp.maxR)
      colorCountTemp.maxR = colorCountTemp.R[data[i]]

    colorCountTemp.G[data[i + 1]]++
    if (colorCountTemp.G[data[i + 1]] > colorCountTemp.maxG)
      colorCountTemp.maxG = colorCountTemp.G[data[i + 1]]

    colorCountTemp.B[data[i + 2]]++
    if (colorCountTemp.B[data[i + 2]] > colorCountTemp.maxB)
      colorCountTemp.maxB = colorCountTemp.B[data[i + 2]]

    colorCountTemp.RGB[data[i]]++
    colorCountTemp.RGB[data[i + 1]]++
    colorCountTemp.RGB[data[i + 2]]++
    if (colorCountTemp.RGB[data[i]] > colorCountTemp.maxRGB)
      colorCountTemp.maxRGB = colorCountTemp.RGB[data[i]]
    if (colorCountTemp.RGB[data[i + 1]] > colorCountTemp.maxRGB)
      colorCountTemp.maxRGB = colorCountTemp.RGB[data[i + 1]]
    if (colorCountTemp.RGB[data[i + 2]] > colorCountTemp.maxRGB)
      colorCountTemp.maxRGB = colorCountTemp.RGB[data[i + 2]]
  }
  colorCount.value = colorCountTemp
}

watch(
  () => colorCorrectionStore.file,
  (file) => {
    imageCanvas.value?.loadImage(file)
  },
)

const handleImageLoaded = (data) => {
  savedImageData.value = new ImageData(data.data, data.width)
  tempImageData.value = new ImageData(data.data, data.width)
  createColorHist(savedImageData.value.data)
  imageCanvas.value?.draw(savedImageData.value)
}

const correctColor = (oldValue, valueMapperFunction, ratioTo255) => {
  let newVal = valueMapperFunction(oldValue * ratioTo255) / ratioTo255
  if (newVal - 255 > 1e-8) newVal = 255
  if (newVal < 1e-8) newVal = 0
  return newVal
}

const render = (
  redChannel,
  greenChannel,
  blueChannel,
  redMapperFunction,
  greenMapperFunction,
  blueMapperFunction,
) => {
  const rerenderTime = Date.now()
  if (rerenderTime - lastRerenderTime >= waitInterval) {
    if (savedImageData.value == null) return
    const data = new Uint8ClampedArray(savedImageData.value.data)
    for (let i = 0; i < data.length; i += 4) {
      if (redChannel)
        data[i] =
          correctColor(
            data[i],
            redMapperFunction,
            colorCorrectionStore.curveCanvasSizeRatioTo255,
          ) ?? 0
      if (greenChannel)
        data[i + 1] =
          correctColor(
            data[i + 1],
            greenMapperFunction,
            colorCorrectionStore.curveCanvasSizeRatioTo255,
          ) ?? 0
      if (blueChannel)
        data[i + 2] =
          correctColor(
            data[i + 2],
            blueMapperFunction,
            colorCorrectionStore.curveCanvasSizeRatioTo255,
          ) ?? 0
    }
    tempImageData.value = new ImageData(data, savedImageData.value.width)
    imageCanvas.value?.draw(tempImageData.value)
  }
}

let lastRerenderTime = Date.now()
const waitInterval = 100
const onCurveChanged = (ps) => {
  lastRerenderTime = Date.now()
  const redChannel = colorCorrectionStore.affectRedChannel
  const greenChannel = colorCorrectionStore.affectGreenChannel
  const blueChannel = colorCorrectionStore.affectBlueChannel
  const redMapperFunction = (val) => evaluateInterpolationAtPoint(val, ps)
  const greenMapperFunction = (val) => evaluateInterpolationAtPoint(val, ps)
  const blueMapperFunction = (val) => evaluateInterpolationAtPoint(val, ps)
  setTimeout(() => {
    render(
      redChannel,
      greenChannel,
      blueChannel,
      redMapperFunction,
      greenMapperFunction,
      blueMapperFunction,
    )
  }, waitInterval)
}

const handleZoomTo1 = () => {
  imageCanvas.value?.zoomViewToPoint(1, 0, 0)
  imageCanvas.value?.translateViewToPoint(0, 0)
  imageCanvas.value?.redrawView()
}

function handleChangeMode(mode) {
  switch (mode) {
    case 'RGB':
      colorCorrectionStore.affectRGB()
      break
    case 'R':
      colorCorrectionStore.affectRed()
      break
    case 'G':
      colorCorrectionStore.affectGreen()
      break
    case 'B':
      colorCorrectionStore.affectBlue()
      break
  }
}
</script>

<template>
  <div class="color-correction__work-view">
    <ColorCorrectionMenu />
    <div class="p-1 flex gap-1 items-center">
      <ToggleGroup
        type="single"
        class="justify-start"
        @update:model-value="handleChangeMode"
      >
        <ToggleGroupItem value="RGB"> RGB </ToggleGroupItem>
        <ToggleGroupItem value="R"> <span style="color: red">R</span> </ToggleGroupItem>
        <ToggleGroupItem value="G"> <span style="color: green">G</span> </ToggleGroupItem>
        <ToggleGroupItem value="B"> <span style="color: blue">B</span> </ToggleGroupItem>
      </ToggleGroup>
      <Separator
        orientation="vertical"
        class="h-6"
      />
      <Button
        variant="ghost"
        @click="imageCanvas.zoom(1.5, 0, 0)"
      >
        <ZoomIn />
      </Button>
      <Button
        variant="ghost"
        @click="imageCanvas.zoom(0.75, 0, 0)"
      >
        <ZoomOut />
      </Button>
      <Button
        variant="ghost"
        @click="handleZoomTo1()"
      >
        <Maximize />
      </Button>
    </div>
    <div
      class="color-correction__canvas flex gap-2"
      style="position: relative; height: calc(100vh - 144px)"
    >
      <Card class="color-correction__tools absolute top-1 right-1">
        <CardContent class="p-2">
          <CurveCanvas
            ref="curveCanvas"
            :colorHistogram="colorCount"
            :curve-color="colorCorrectionStore.curveColor"
            @curve-changed="onCurveChanged"
          />
        </CardContent>
        <CardFooter class="p-2 flex gap-1 justify-center">
          <div class="flex gap-1 flex-col">
            <Button
              variant="ghost"
              @click="colorCorrectionStore.resetCurve"
              >Reset</Button
            >
            <Button
              variant="ghost"
              @click="colorCorrectionStore.negativeCurve"
              >Negative</Button
            >
          </div>
          <div class="flex gap-1 flex-col">
            <Button
              variant="ghost"
              @click="colorCorrectionStore.contrastCurve"
              >Contrast</Button
            >
            <Button
              variant="ghost"
              @click="colorCorrectionStore.decontrastCurve"
              >Decontrast</Button
            >
          </div>
        </CardFooter>
      </Card>
      <div
        ref="imageCanvasContainer"
        style="overflow: hidden; width: 100%; height: 100%"
      >
        <ImageCanvas
          ref="imageCanvas"
          bg-color="#333333"
          :width="canvasWidth"
          :height="canvasHeight"
          @image-loaded="handleImageLoaded"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
