<script setup>
import { ref, shallowRef, onUnmounted, watch } from "vue"
import Checkbox from 'primevue/checkbox'
import Slider from 'primevue/slider';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import { debounce } from "@/utils/debounce";

const context = shallowRef(null);
const gainNode = shallowRef();
const buffer = shallowRef();
const beatsCirclesTimer = shallowRef();
const timeSignatureSoundTimer = shallowRef();
const bakedBuffer = shallowRef(null);
const isPlaying = ref(false);
const volume = ref(50);
const source = shallowRef(null);
const stressFirstBeat = ref(true);
const stressedVolumeRatio = ref(5);
const bpm = ref(100);
const repeats = ref(2);
const currentBeat = ref(null);
const repeatTimeSignatures = ref();

// we are not invoking init in OnMounted hook because we wait any user gesture
const initContext = async () => {
    context.value = new AudioContext({
        sampleRate: 32000
    });
    gainNode.value = context.value.createGain();
    gainNode.value.gain.value = volume.value / 100;
    gainNode.value.connect(context.value.destination);
    try {
        const response = await fetch("sounds/metronome.wav");
        buffer.value = await context.value.decodeAudioData(await response.arrayBuffer());
    } catch (err) {
        console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
}

const setBeatCirclesTimer = () => {
    beatsCirclesTimer.value = setTimeout(() => {
        currentBeat.value = (currentBeat.value == repeats.value) ? 1 : currentBeat.value + 1;
        clearTimeout(beatsCirclesTimer.value);
        setBeatCirclesTimer()
    }, 60 / bpm.value * 1000)
}

const setTimeSignatureSoundTimer = () => {
    source.value?.stop();
    clearBeatCirclesTimer();
    changeAudioSource();
    source.value.start();
    currentBeat.value = 1;
    setBeatCirclesTimer();
    timeSignatureSoundTimer.value = setTimeout(() => {
        clearTimeout(timeSignatureSoundTimer.value);
        setTimeSignatureSoundTimer();
    }, 60 / bpm.value * repeatTimeSignatures.value * repeats.value * 1000)
}

const clearBeatCirclesTimer = () => {
    if (beatsCirclesTimer.value)
        clearTimeout(beatsCirclesTimer.value);
    currentBeat.value = null;
}

const clearTimeSignatureSoundTimer = () => {
    if (timeSignatureSoundTimer.value)
        clearTimeout(timeSignatureSoundTimer.value);
    clearBeatCirclesTimer();
}

const handlePlayButtonClicked = async () => {
    if (!context.value)
        await initContext();
    if (!bakeBuffer.value)
        bakeBuffer();
    if (isPlaying.value) {
        source.value?.stop();
        isPlaying.value = false;
        clearTimeSignatureSoundTimer();
    } else {
        setTimeSignatureSoundTimer();
        isPlaying.value = true;
    }
}

const updateSettings = debounce(async () => {
    if (!context.value)
        await initContext();
    bakeBuffer();
    if (isPlaying.value) {
        clearTimeSignatureSoundTimer();
        setTimeSignatureSoundTimer();
    }
}, 500)

watch([stressFirstBeat, bpm, repeats], () => {
    clearTimeSignatureSoundTimer();
    updateSettings();
})

watch([volume], () => {
    gainNode.value.gain.value = volume.value / 100;
},)

const changeAudioSource = () => {
    source.value = context.value.createBufferSource();
    source.value.buffer = bakedBuffer.value;
    source.value.connect(gainNode.value).connect(context.value.destination);
}

const bakeBuffer = () => {
    const beatDuration = 60 / bpm.value;
    // helps to synchronize timer with sound source
    // they are desynchronized approximately in 5 second
    // so I want repeat it frequetly, but not too much (in this case time for creating new timer starts to come out)
    repeatTimeSignatures.value = Math.max(1, Math.floor(5 / (beatDuration * repeats.value)));  // repeat one time or N times to fill 5 sec
    const frameCount = Math.floor(context.value.sampleRate * beatDuration * repeatTimeSignatures.value * repeats.value);
    const beatsSoundBuffer = context.value.createBuffer(
        2,
        frameCount,
        context.value.sampleRate
    );
    const metronomSoundBuffer = buffer.value.getChannelData(0)  // current sound is mono, so first and only channel with index 0
    const beatWithSilenceFrameCount = Math.floor(frameCount / repeatTimeSignatures.value / repeats.value);
    for (let channel = 0; channel < 2; channel++) {
        let beatIndex = 0;
        const nowBuffering = beatsSoundBuffer.getChannelData(channel)
        for (let i = 0; i < frameCount; i++) {
            if (i % beatWithSilenceFrameCount == 0) {
                bakeBeatSound(nowBuffering, metronomSoundBuffer, i, !stressFirstBeat.value || (beatIndex % repeats.value === 0))
                beatIndex++;
            }
        }
    }
    bakedBuffer.value = beatsSoundBuffer;
}

const bakeBeatSound = (buffer, metronomSoundBuffer, frameIndex, stressBeat) => {
    let j = 0;
    let start = frameIndex;
    let end = frameIndex + metronomSoundBuffer.length;
    for (let i = start; i < end; i++) {
        if (j >= metronomSoundBuffer.length) {
            break;
        }
        buffer[i] = buffer[i] + metronomSoundBuffer[j] / (stressBeat ? 1 : stressedVolumeRatio.value)
        j++;
    }
}

onUnmounted(() => {
    context.value?.close()
    if (beatsCirclesTimer.value)
        clearTimeout(beatsCirclesTimer.value);
    if (timeSignatureSoundTimer.value)
        clearTimeout(timeSignatureSoundTimer.value);
})
</script>

<template>
    <div class="metronome__work-view flex flex-col md:flex-row gap-4">
        <div class="metronome__control-panel flex flex-col w-full md:w-64 gap-2">
            <div class="border-slate-200 dark:border-slate-100 border-b-[1px] pb-3">
                <label for="bpm" class="font-bold block mb-2">BPM</label>
                <InputNumber v-model="bpm" class="mb-4" />
                <div class="flex items-center">
                    <div class="metronome__bpm-lower-bound-label mr-2 text-sm">30</div>
                    <Slider v-model="bpm" class="w-full mr-4" name="bpm" :min="30" :max="300" />
                    <div class="metronome__bpm-upper-bound-label text-sm">300</div>
                </div>
            </div>
            <div class="border-slate-200 dark:border-slate-100 border-b-[1px] pb-3">
                <label for="repeats" class="font-bold block mb-2"> Time signature </label>
                <InputNumber v-model="repeats" inputId="repeats" mode="decimal" showButtons buttonLayout="horizontal"
                    :min="1" :max="12" class="w-48" fluid>
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" :style="{ fontSize: '0.75rem' }" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" :style="{ fontSize: '0.75rem' }" />
                    </template>
                </InputNumber>
            </div>
            <div class="border-slate-200 dark:border-slate-100 border-b-[1px] pb-3">
                <div class="flex items-center">
                    <Checkbox v-model="stressFirstBeat" :binary="true" inputId="stressFirstBeat"
                        name="stressFirstBeat" />
                    <label for="stressFirstBeat" class="ml-2">Stress first beat</label>
                </div>
            </div>
            <div class="border-slate-200 dark:border-slate-100 border-b-[1px] pb-5 mb-3">
                <label for="bpm" class="font-bold block mb-2">Volume</label>
                <div class="flex items-center">
                    <Slider v-model="volume" class="w-full" name="volume" :min="0" :max="200" />
                </div>
            </div>
            <div class="flex justify-center">
                <Button @click="handlePlayButtonClicked" :label="isPlaying ? 'Stop' : 'Start'"
                    :icon="isPlaying ? 'pi pi-stop' : 'pi pi-play'" :severity="isPlaying ? 'danger' : 'secondary'" />
            </div>
        </div>
        <div class="metronome__beats-circles flex gap-1 justify-center items-center">
            <div v-for="b in repeats" :key="b" class="rounded-full border-2 size-5 md:size-6" :class="{
                'bg-red-700 border-red-900': (b === currentBeat)
            }"></div>
        </div>
    </div>
</template>