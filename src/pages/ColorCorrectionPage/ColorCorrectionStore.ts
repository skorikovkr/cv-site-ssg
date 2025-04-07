import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

export const useColorCorrectionStore = defineStore('color-correction', () => {
  const file = shallowRef(null)
  const imageCanvas = shallowRef(null)
  const affectRedChannel = ref(true)
  const affectGreenChannel = ref(true)
  const affectBlueChannel = ref(true)
  const curveColor = ref('#FAFAFA')
  const curveCanvasSize = ref(256)
  const curveCanvasSizeRatioTo255 = ref(1) // assuming interpolation always start at x:0
  const initialPoints = [
    { x: 0, y: 0, blockX: true },
    { x: curveCanvasSize.value, y: curveCanvasSize.value, blockX: true },
  ]
  const points = ref(initialPoints.map((p) => ({ ...p })))

  const affectRGB = () => {
    curveColor.value = '#FAFAFA'
    affectRedChannel.value = true
    affectGreenChannel.value = true
    affectBlueChannel.value = true
  }

  const affectRed = () => {
    curveColor.value = '#FF0000'
    affectRedChannel.value = true
    affectGreenChannel.value = false
    affectBlueChannel.value = false
  }

  const affectGreen = () => {
    curveColor.value = '#00FF00'
    affectRedChannel.value = false
    affectGreenChannel.value = true
    affectBlueChannel.value = false
  }

  const affectBlue = () => {
    curveColor.value = '#148aff'
    affectRedChannel.value = false
    affectGreenChannel.value = false
    affectBlueChannel.value = true
  }

  const resetCurve = () => {
    points.value = initialPoints.map((p) => ({ ...p }))
  }

  const negativeCurve = () => {
    setCurve([
      { x: 0, y: curveCanvasSize.value },
      { x: curveCanvasSize.value, y: 0 },
    ])
  }

  const contrastCurve = () => {
    const contrastValue = curveCanvasSize.value / 8
    setCurve([
      { x: 0, y: 0 },
      { x: (curveCanvasSize.value * 1) / 4, y: (curveCanvasSize.value * 1) / 4 - contrastValue },
      { x: (curveCanvasSize.value * 3) / 4, y: (curveCanvasSize.value * 3) / 4 + contrastValue },
      { x: curveCanvasSize.value, y: curveCanvasSize.value },
    ])
  }

  const decontrastCurve = () => {
    const decontrastValue = curveCanvasSize.value / 8
    setCurve([
      { x: 0, y: 0 },
      { x: (curveCanvasSize.value * 1) / 4, y: (curveCanvasSize.value * 1) / 4 + decontrastValue },
      { x: (curveCanvasSize.value * 3) / 4, y: (curveCanvasSize.value * 3) / 4 - decontrastValue },
      { x: curveCanvasSize.value, y: curveCanvasSize.value },
    ])
  }

  const setCurve = (ps) => {
    if (ps.length < 2) {
      points.value = initialPoints.map((p) => ({ ...p }))
      throw new Error('Argument exception. Needs two or more points to build curve.')
    }
    if (ps[0].x !== 0 || ps[ps.length - 1].x !== curveCanvasSize.value) {
      points.value = initialPoints.map((p) => ({ ...p }))
      throw new Error(
        'Argument exception. First and last points must be at start and end of X axis.',
      )
    }
    ps[0].blockX = true
    ps[ps.length - 1].blockX = true
    points.value = ps.map((p) => ({ ...p }))
  }

  return {
    file,
    imageCanvas,
    affectRedChannel,
    affectGreenChannel,
    affectBlueChannel,
    curveColor,
    curveCanvasSize,
    curveCanvasSizeRatioTo255,
    points,

    affectRGB,
    affectRed,
    affectBlue,
    affectGreen,
    resetCurve,
    negativeCurve,
    contrastCurve,
    decontrastCurve,
    setCurve,
  }
})
