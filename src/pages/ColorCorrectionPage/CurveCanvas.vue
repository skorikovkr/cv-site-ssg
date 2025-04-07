<script setup lang="ts">
import { computed, ref } from 'vue'
import DraggablePoint from './DraggablePoint.vue'
import { cubicSplineInterpolation, getSVGPathForSpline } from '../../utils/cubicSplineInterpolation'
import { solveCubic } from '../../utils/cubicSolver'
import { useColorCorrectionStore } from './ColorCorrectionStore'

defineProps({
  colorHistogram: {
    type: Object,
    required: false,
  },
  pointRadius: {
    type: Number,
    default: 7,
  },
  curveColor: {
    type: String,
    default: '#FAFAFA',
  },
})

const emit = defineEmits(['curveChanged'])

const colorCorrectionStore = useColorCorrectionStore()

const isOutOfBounds = (p, ignoreXAxis = false, ignoreYAxis = false) => {
  if (!ignoreXAxis && (p.x < 0 || p.x > colorCorrectionStore.curveCanvasSize)) return true
  if (!ignoreYAxis && (p.y < 0 || p.y > colorCorrectionStore.curveCanvasSize)) return true
  return false
}

const sortedPoints = computed(() => {
  const tempPoints = [...colorCorrectionStore.points]
  tempPoints.sort((p1, p2) => p1.x - p2.x)
  return tempPoints
})

const gridLines = computed(() => ({
  vertical: [1, 2, 3].forEach((i) => ({
    x1: (i * colorCorrectionStore.curveCanvasSize) / 4,
    y1: 0,
    x2: (i * colorCorrectionStore.curveCanvasSize) / 4,
    y2: colorCorrectionStore.curveCanvasSize,
    n: i,
  })),
  horizontal: [1, 2, 3].forEach((i) => ({
    x1: 0,
    y1: (i * colorCorrectionStore.curveCanvasSize) / 4,
    x2: colorCorrectionStore.curveCanvasSize,
    y2: (i * colorCorrectionStore.curveCanvasSize) / 4,
    n: i,
  })),
}))

const currentDraggablePointIndex = ref(null)

const cubicPolynomials = computed(() => {
  let prevPoint = sortedPoints.value[0]
  // avoid curve distortion on two point.x equality
  const tempPoints = [{ x: sortedPoints.value[0].x, y: sortedPoints.value[0].y }]
  for (let i = 1; i < sortedPoints.value.length; i++) {
    if (prevPoint.x === sortedPoints.value[i].x)
      tempPoints.push({ x: sortedPoints.value[i].x + 1, y: sortedPoints.value[i].y })
    else tempPoints.push({ x: sortedPoints.value[i].x, y: sortedPoints.value[i].y })
    prevPoint = sortedPoints.value[i]
  }
  const result = cubicSplineInterpolation(tempPoints)
  emit('curveChanged', result)
  return result
})

const svgPath = computed(() => getSVGPathForSpline(cubicPolynomials.value, sortedPoints.value))

// Line to show culling negatives to zero or max value
const curveOutOfBoundPoints = computed(() => {
  const pointsOutOfBounds = []
  // with lower bound
  cubicPolynomials.value.forEach((p) => {
    const solutionsWithZero = solveCubic(
      p.polynomial.A,
      p.polynomial.B,
      p.polynomial.C,
      p.polynomial.D,
    )
    if (solutionsWithZero.length < 2) return // avoid unnecessary calculations
    const cubicSolutions = []
    solutionsWithZero.forEach((point) => {
      if (point >= p.range.xmin && point <= p.range.xmax) cubicSolutions.push({ x: point, y: 0 })
    })
    if (cubicSolutions.length == 2)
      // we want to draw line between only two points
      pointsOutOfBounds.push(cubicSolutions)
  })
  // with upper bound
  cubicPolynomials.value.forEach((p) => {
    const upperD = p.polynomial.D - colorCorrectionStore.curveCanvasSize - 0.5 // find solution on a little lower height for prettier look
    const solutionsWithMax = solveCubic(p.polynomial.A, p.polynomial.B, p.polynomial.C, upperD)
    if (solutionsWithMax.length < 2) return // avoid unnecessary calculations
    const cubicSolutions = []
    solutionsWithMax.forEach((point) => {
      if (point >= p.range.xmin && point <= p.range.xmax)
        cubicSolutions.push({ x: point, y: colorCorrectionStore.curveCanvasSize })
    })
    if (cubicSolutions.length == 2) pointsOutOfBounds.push(cubicSolutions)
  })
  return pointsOutOfBounds
})

const handleChangeCoords = (e) => {
  if (currentDraggablePointIndex.value === null) return
  const currentPoint = colorCorrectionStore.points[currentDraggablePointIndex.value]
  const newXPosition = e.offsetX
  const newYPosition = e.offsetY
  if (currentPoint.blockX) {
    if (!isOutOfBounds({ x: newXPosition, y: newYPosition }, true)) {
      currentPoint.y = newYPosition
    }
  } else {
    if (!isOutOfBounds({ x: newXPosition, y: newYPosition })) {
      currentPoint.x = newXPosition
      currentPoint.y = newYPosition
    }
  }
}

const handleStartDragging = (pointIndex) => {
  currentDraggablePointIndex.value = pointIndex
}

const handleStopDragging = () => {
  currentDraggablePointIndex.value = null
}

const handleNotPointMouseDown = (e) => {
  const newPoint = { x: e.offsetX, y: e.offsetY }
  if (isOutOfBounds(newPoint)) return
  const tempPoints = [...colorCorrectionStore.points]
  tempPoints.push(newPoint)
  tempPoints.sort((p1, p2) => p1.x - p2.x)
  colorCorrectionStore.points = tempPoints
}

const handleMouseLeave = () => {
  currentDraggablePointIndex.value = null
}
</script>

<template>
  <div
    class="curve-canvas-container"
    :style="{
      height: colorCorrectionStore.curveCanvasSize + 'px',
      width: colorCorrectionStore.curveCanvasSize + 'px',
    }"
    @mouseup="handleStopDragging"
    @mousemove="handleChangeCoords"
    @mousedown="handleNotPointMouseDown"
    @mouseleave="handleMouseLeave"
  >
    <svg class="curve-canvas">
      <!-- Grid -->
      <line
        v-for="l in gridLines.vertical"
        :key="l.n"
        :x1="l.x1"
        :y1="l"
        :x2="l"
        :y2="l"
        stroke="#eeeeee"
        stroke-width="1"
        stroke-dasharray="2,2"
      />
      <line
        v-for="i in gridLines.horizontal"
        :key="i.n"
        :x1="l.x1"
        :y1="l"
        :x2="l"
        :y2="l"
        stroke="#eeeeee"
        stroke-width="1"
        stroke-dasharray="2,2"
      />

      <!-- Bounds -->
      <line
        :x1="0"
        :y1="0"
        :x2="colorCorrectionStore.curveCanvasSize"
        :y2="0"
        stroke="#eeeeee"
        stroke-width="2"
      />
      <line
        :x1="colorCorrectionStore.curveCanvasSize"
        :y1="0"
        :x2="colorCorrectionStore.curveCanvasSize"
        :y2="colorCorrectionStore.curveCanvasSize"
        stroke="#eeeeee"
        stroke-width="2"
      />
      <line
        :x1="colorCorrectionStore.curveCanvasSize"
        :y1="colorCorrectionStore.curveCanvasSize"
        :x2="0"
        :y2="colorCorrectionStore.curveCanvasSize"
        stroke="#eeeeee"
        stroke-width="2"
      />
      <line
        :x1="0"
        :y1="colorCorrectionStore.curveCanvasSize"
        :x2="0"
        :y2="0"
        stroke="#eeeeee"
        stroke-width="2"
      />

      <!-- Histogram -->
      <rect
        v-for="(value, i) in colorHistogram?.RGB ?? []"
        :key="i"
        :x="((i - 1) * colorCorrectionStore.curveCanvasSize) / 256"
        :y="1"
        :height="
          colorHistogram?.maxRGB === 0
            ? 0
            : Math.max(
                (value / (colorHistogram?.maxRGB ?? 1)) * colorCorrectionStore.curveCanvasSize - 2,
                0,
              )
        "
        :width="colorCorrectionStore.curveCanvasSize / 256"
        fill="#666666"
      />

      <!-- Curve -->
      <path
        :d="svgPath"
        fill="none"
        :stroke="curveColor"
        stroke-width="2"
      ></path>
      <line
        v-for="(p, i) in curveOutOfBoundPoints"
        :key="i"
        :x1="p[0].x"
        :y1="p[0].y"
        :x2="p[1].x"
        :y2="p[1].y"
        :stroke="curveColor"
        stroke-width="4"
      />

      <!-- Points -->
      <DraggablePoint
        v-for="(p, i) in colorCorrectionStore.points"
        :key="i"
        :point="p"
        :radius="pointRadius"
        :color="curveColor"
        @startDragging="() => handleStartDragging(i)"
      />
    </svg>
  </div>
</template>

<style scoped>
.curve-canvas-container {
  background-color: #333333;
}

.curve-canvas {
  background-color: #333333;
  transform-origin: center center;
  transform: scale(1, -1);
  height: 100%;
  width: 100%;
}
</style>
