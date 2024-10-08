<script setup>
import { ref, onMounted } from 'vue';
import CurveCanvas from './CurveCanvas.vue';
import { evaluateInterpolationAtPoint } from '../../utils/cubicSplineInterpolation';
import ImageCanvas from './ImageCanvas.vue';
import FileUploader from '@/components/FileUpload/FileUploader.vue';

const curveCanvas = ref();
const imageCanvas = ref();
let savedImageData = null;
let tempImageData = null;
const curveColor = ref('#FAFAFA');
const curveCanvasSize = 256;
const curveCanvasSizeRatioTo255 = curveCanvasSize / 256;  // assuming interpolation always start at x:0
const colorCount = ref({
    R: Array.from({ length: 256 }, () => 0),
    G: Array.from({ length: 256 }, () => 0),
    B: Array.from({ length: 256 }, () => 0),
    RGB: Array.from({ length: 256 }, () => 0),
    maxR: 0,
    maxG: 0,
    maxB: 0,
    maxRGB: 0,
});

onMounted(() => {
    imageCanvas.value?.draw(tempImageData);
});

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
    };
    for (let i = 0; i < data.length; i += 4) {
        colorCountTemp.R[data[i]]++;
        if (colorCountTemp.R[data[i]] > colorCountTemp.maxR)
            colorCountTemp.maxR = colorCountTemp.R[data[i]];

        colorCountTemp.G[data[i + 1]]++;
        if (colorCountTemp.G[data[i + 1]] > colorCountTemp.maxG)
            colorCountTemp.maxG = colorCountTemp.G[data[i + 1]];

        colorCountTemp.B[data[i + 2]]++;
        if (colorCountTemp.B[data[i + 2]] > colorCountTemp.maxB)
            colorCountTemp.maxB = colorCountTemp.B[data[i + 2]];

        colorCountTemp.RGB[data[i]]++;
        colorCountTemp.RGB[data[i + 1]]++;
        colorCountTemp.RGB[data[i + 2]]++;
        if (colorCountTemp.RGB[data[i]] > colorCountTemp.maxRGB)
            colorCountTemp.maxRGB = colorCountTemp.RGB[data[i]];
        if (colorCountTemp.RGB[data[i + 1]] > colorCountTemp.maxRGB)
            colorCountTemp.maxRGB = colorCountTemp.RGB[data[i + 1]];
        if (colorCountTemp.RGB[data[i + 2]] > colorCountTemp.maxRGB)
            colorCountTemp.maxRGB = colorCountTemp.RGB[data[i + 2]];
    }
    colorCount.value = colorCountTemp;
}

const handleOpenImage = (file) => {
    if (imageCanvas.value != null) {
        imageCanvas.value.loadImage(file);
    }
}

const handleImageLoaded = (data) => {
    savedImageData = new ImageData(data.data, data.width);
    tempImageData = new ImageData(data.data, data.width);
    createColorHist(savedImageData.data);
    imageCanvas.value?.draw(savedImageData);
}

const affectRedChannel = ref(true);
const affectGreenChannel = ref(true);
const affectBlueChannel = ref(true);

const correctColor = (
    oldValue,
    valueMapperFunction,
    ratioTo255
) => {
    let newVal = valueMapperFunction(oldValue * ratioTo255) / ratioTo255;
    if (newVal - 255 > 1e-8)
        newVal = 255;
    if (newVal < 1e-8)
        newVal = 0;
    return newVal;
}

const render = (
    redChannel, greenChannel, blueChannel,
    redMapperFunction, greenMapperFunction, blueMapperFunction,
) => {
    const rerenderTime = Date.now();
    if ((rerenderTime - lastRerenderTime) >= waitInterval) {
        if (savedImageData == null) return;
        const data = new Uint8ClampedArray(savedImageData.data);
        for (let i = 0; i < data.length; i += 4) {
            if (redChannel)
                data[i] = correctColor(data[i], redMapperFunction, curveCanvasSizeRatioTo255) ?? 0;
            if (greenChannel)
                data[i + 1] = correctColor(data[i + 1], greenMapperFunction, curveCanvasSizeRatioTo255) ?? 0;
            if (blueChannel)
                data[i + 2] = correctColor(data[i + 2], blueMapperFunction, curveCanvasSizeRatioTo255) ?? 0;
        }
        tempImageData = new ImageData(data, savedImageData.width);
        imageCanvas.value?.draw(tempImageData);
    }
}

let lastRerenderTime = Date.now();
const waitInterval = 100;
const onCurveChanged = (ps) => {
    lastRerenderTime = Date.now();
    const redChannel = affectRedChannel.value;
    const greenChannel = affectGreenChannel.value;
    const blueChannel = affectBlueChannel.value;
    const redMapperFunction = (val) => evaluateInterpolationAtPoint(val, ps);
    const greenMapperFunction = (val) => evaluateInterpolationAtPoint(val, ps);
    const blueMapperFunction = (val) => evaluateInterpolationAtPoint(val, ps);
    setTimeout(() => {
        render(redChannel, greenChannel, blueChannel, redMapperFunction, greenMapperFunction, blueMapperFunction);
    }, waitInterval);
}

const handleClick = () => {
    curveCanvas.value?.reset();
};

const handleNegativeClick = () => {
    curveCanvas.value?.set([
        { x: 0, y: curveCanvasSize },
        { x: curveCanvasSize, y: 0 }
    ]);
}

const handleContrastClick = () => {
    const contrastValue = curveCanvasSize / 8;
    curveCanvas.value?.set([
        { x: 0, y: 0 },
        { x: curveCanvasSize * 1 / 4, y: curveCanvasSize * 1 / 4 - contrastValue },
        { x: curveCanvasSize * 3 / 4, y: curveCanvasSize * 3 / 4 + contrastValue },
        { x: curveCanvasSize, y: curveCanvasSize }
    ]);
}

const handleDecontrastClick = () => {
    const decontrastValue = curveCanvasSize / 8;
    curveCanvas.value?.set([
        { x: 0, y: 0 },
        { x: curveCanvasSize * 1 / 4, y: curveCanvasSize * 1 / 4 + decontrastValue },
        { x: curveCanvasSize * 3 / 4, y: curveCanvasSize * 3 / 4 - decontrastValue },
        { x: curveCanvasSize, y: curveCanvasSize }
    ]);
}

const handleRGBChannelClick = () => {
    curveColor.value = '#FAFAFA';
    affectRedChannel.value = true;
    affectGreenChannel.value = true;
    affectBlueChannel.value = true;
}

const handleRChannelClick = () => {
    curveColor.value = '#FF0000';
    affectRedChannel.value = true;
    affectGreenChannel.value = false;
    affectBlueChannel.value = false;
}

const handleGChannelClick = () => {
    curveColor.value = '#00FF00';
    affectRedChannel.value = false;
    affectGreenChannel.value = true;
    affectBlueChannel.value = false;
}

const handleBChannelClick = () => {
    curveColor.value = '#148aff';
    affectRedChannel.value = false;
    affectGreenChannel.value = false;
    affectBlueChannel.value = true;
}

const handleZoomTo1 = () => {
    imageCanvas.value?.zoomViewToPoint(1, 0, 0);
    imageCanvas.value?.translateViewToPoint(0, 0);
    imageCanvas.value?.redrawView();
}

</script>

<template>
    <div class="color-correction__work-view">
        <FileUploader class="mb-4" @fileUploaded="handleOpenImage" />
        <div class="color-correction__canvas flex gap-2">
            <div class="color-correction__tools mb-2">
                <CurveCanvas ref="curveCanvas" :size="curveCanvasSize" :colorHistogram="colorCount"
                    :curve-color="curveColor" @curve-changed="onCurveChanged" />
                <span class="italic font-semibold">Presets:</span>
                <div class="color-correction__toolbox flex flex-col ml-2 items-start">
                    <button @click="handleClick">Reset</button>
                    <button @click="handleNegativeClick">Negative</button>
                    <button @click="handleContrastClick">Contrast</button>
                    <button @click="handleDecontrastClick">Decontrast</button>
                </div>
                <span class="italic font-semibold">Channels:</span>
                <div class="color-correction__channels flex gap-3 ml-2 flex-auto">
                    <button @click="handleRGBChannelClick">RGB</button>
                    <button @click="handleRChannelClick">R</button>
                    <button @click="handleGChannelClick">G</button>
                    <button @click="handleBChannelClick">B</button>
                </div>
                <button @click="handleZoomTo1" class="italic font-semibold">Zoom to original</button>
            </div>
            <ImageCanvas ref="imageCanvas" :height="700" :width="760" bg-color="#333333"
                @image-loaded="handleImageLoaded" />
        </div>
    </div>
</template>

<style scoped></style>