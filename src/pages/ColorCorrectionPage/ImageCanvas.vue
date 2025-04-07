<script setup>
import { onMounted, ref, shallowRef, watch } from 'vue'
import { useColorCorrectionStore } from './ColorCorrectionStore'

const props = defineProps({
  height: Number,
  width: Number,
  bgColor: {
    type: String,
    default: '#AAAAAA',
  },
})

const emit = defineEmits(['imageLoaded'])

const colorCorrectionStore = useColorCorrectionStore()

const viewCanvas = ref()
colorCorrectionStore.imageCanvas = document.createElement('canvas')
const inMemContext = shallowRef(null)
const viewContext = shallowRef(null)
const img = ref(new Image())
const isDragging = ref(false)
const dragStartPosition = ref(new DOMPoint(0, 0))
const currentCursor = ref(null)
const zoomMulti = ref(1)

onMounted(() => {
  if (viewCanvas.value == null || colorCorrectionStore.imageCanvas == null)
    throw new Error('Error initializing canvas.')
  viewContext.value = viewCanvas.value.getContext('2d', { willReadFrequently: true })
  inMemContext.value = colorCorrectionStore.imageCanvas.getContext('2d', {
    willReadFrequently: true,
  })
  if (inMemContext.value == null || viewContext.value == null)
    throw new Error('Error getting canvas context.')
})

watch([() => props.width, () => props.height], ([w, h]) => {
  viewCanvas.value.width = w
  viewCanvas.value.height = h
  redrawView()
})

const getTransformedPoint = (x, y) => {
  if (viewContext.value == null) return null
  const originalPoint = new DOMPoint(x, y)
  return viewContext.value?.getTransform().invertSelf().transformPoint(originalPoint)
}

const handleMouseDown = (e) => {
  if (e.button == 0) {
    if (viewCanvas.value == null || viewContext.value == null) return
    isDragging.value = true
    dragStartPosition.value = getTransformedPoint(e.offsetX, e.offsetY)
  }
}

const handleMouseMove = (e) => {
  currentCursor.value = new DOMPoint(e.offsetX, e.offsetY)
  if (e.button == 0) {
    if (
      isDragging.value &&
      viewContext.value != null &&
      currentCursor.value != null &&
      dragStartPosition.value != null
    ) {
      const currentTransformedCursor = getTransformedPoint(
        currentCursor.value.x,
        currentCursor.value.y,
      )
      if (currentTransformedCursor == null) return
      translateViewAbsolute(
        currentTransformedCursor.x - dragStartPosition.value.x,
        currentTransformedCursor.y - dragStartPosition.value.y,
      )
      redrawView()
    }
  }
}

const handleMouseUp = () => {
  isDragging.value = false
}

const handleWheel = (e) => {
  if (currentCursor.value == null) return
  const zoomValue = e.deltaY < 0 ? 1.075 : 0.925
  zoom(zoomValue, currentCursor.value.x, currentCursor.value.y)
  e.preventDefault()
}

function zoom(zoom, x, y) {
  zoomViewToPoint(zoomMulti.value * zoom, x, y)
  redrawView()
}

const zoomViewToPoint = (scale, originX, originY) => {
  if (viewContext.value == null) return
  const currentTransformedCursor = getTransformedPoint(originX, originY)
  if (currentTransformedCursor == null) return
  viewContext.value.translate(currentTransformedCursor.x, currentTransformedCursor.y)
  const prevDOMMatrix = viewContext.value.getTransform()
  prevDOMMatrix.a = 1
  prevDOMMatrix.d = 1
  viewContext.value.setTransform(prevDOMMatrix)
  viewContext.value.scale(scale, scale)
  viewContext.value.translate(-currentTransformedCursor.x, -currentTransformedCursor.y)
  zoomMulti.value = scale
}

const translateViewAbsolute = (x, y) => {
  if (viewContext.value == null) return
  viewContext.value.translate(x, y)
}

const translateViewToPoint = (x, y) => {
  if (viewContext.value == null) return
  const currentTransformedCursor = getTransformedPoint(x, y)
  if (currentTransformedCursor == null) return
  translateViewAbsolute(currentTransformedCursor.x, currentTransformedCursor.y)
}

const loadImage = (file) => {
  img.value.src = URL.createObjectURL(file)
  let imageData = null
  if (viewCanvas.value != null) {
    img.value.onload = () => {
      if (viewContext.value == null || inMemContext.value == null)
        throw new Error('Canvas context is null.')
      colorCorrectionStore.imageCanvas.width = img.value.width
      colorCorrectionStore.imageCanvas.height = img.value.height
      inMemContext.value.drawImage(img.value, 0, 0)
      imageData = inMemContext.value.getImageData(0, 0, img.value.width, img.value.height)
      emit('imageLoaded', imageData)
    }
  }
}

const draw = (data) => {
  if (viewContext.value == null || inMemContext.value == null) return
  if (data == null) return
  inMemContext.value.putImageData(data, 0, 0)
  redrawView()
}

const redrawView = () => {
  if (viewContext.value == null || inMemContext.value == null) return
  viewContext.value.save()
  viewContext.value.setTransform(1, 0, 0, 1, 0, 0)
  viewContext.value.fillStyle = props.bgColor
  viewContext.value.fillRect(0, 0, props.width, props.height)
  viewContext.value.restore()
  viewContext.value.imageSmoothingEnabled = false
  viewContext.value.drawImage(colorCorrectionStore.imageCanvas, 0, 0)
}

defineExpose({
  draw,
  loadImage,
  img,
  redrawView,
  translateViewToPoint,
  zoomViewToPoint,
  zoom,
})
</script>

<template>
  <canvas
    ref="viewCanvas"
    style="width: 100%; height: 100%"
    :style="{ imageRendering: zoomMulti > 3 ? 'pixelated' : 'auto' }"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseUp"
    @wheel="handleWheel"
  ></canvas>
</template>

<style scoped></style>
