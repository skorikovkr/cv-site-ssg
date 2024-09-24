<script setup>
import { ref, shallowRef, onUnmounted, watch } from "vue"
import Checkbox from 'primevue/checkbox'
import Slider from 'primevue/slider';
import InputNumber from 'primevue/inputnumber';
import { debounce } from "@/utils/debounce";

const context = shallowRef(null);
const gainNode = shallowRef();
const buffer = shallowRef();
const isPlaying = ref(false);
const volume = ref(1);
const source = shallowRef(null);
const stressFirstBeat = ref(true);
const stressedVolumeRatio = ref(5);
const bpm = ref(100);
const repeats = ref(2)

const initContext = async () => {
    context.value = new AudioContext({
        sampleRate: 32000
    });
    gainNode.value = context.value.createGain();
    gainNode.value.gain.value = volume.value;
    gainNode.value.connect(context.value.destination);
    try {
        const response = await fetch("sounds/metronome.wav");
        buffer.value = await context.value.decodeAudioData(await response.arrayBuffer());
    } catch (err) {
        console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
}

const handlePlayButtonClicked = async () => {
    if (!context.value)
        await initContext();
    if (isPlaying.value) {
        source.value?.stop();
        isPlaying.value = false;
    } else {
        changeAudioSource();
        source.value.start();
        isPlaying.value = true;
    }
}

const updateSettings = debounce(async () => {
    if (!context.value)
        await initContext();
    if (isPlaying.value) {
        source.value?.stop();
    }
    changeAudioSource();
    if (isPlaying.value)
        source.value.start()
}, 500)

watch([stressFirstBeat, bpm, repeats], () => {
    updateSettings()
})

const changeAudioSource = () => {
    source.value = context.value.createBufferSource();
    const beatDuration = 60 / bpm.value;
    const frameCount = Math.floor(context.value.sampleRate * beatDuration * repeats.value);
    const beatsSoundBuffer = context.value.createBuffer(
        2,
        frameCount,
        context.value.sampleRate
    );
    const metronomSoundBuffer = buffer.value.getChannelData(0)  // current sound is mono, so first and only channel with index 0
    const beatFrameCount = metronomSoundBuffer.length;
    const beatWithSilenceFrameCount = Math.floor(frameCount / repeats.value);
    for (let channel = 0; channel < 2; channel++) {
        let isFirst = true;
        const nowBuffering = beatsSoundBuffer.getChannelData(channel)
        for (let i = 0; i < frameCount; i++) {
            if (i % beatWithSilenceFrameCount == 0) {
                bakeBeatSound(nowBuffering, metronomSoundBuffer, beatFrameCount, i, !stressFirstBeat.value || isFirst)
                isFirst = false;
            }
        }
    }
    source.value.buffer = beatsSoundBuffer;
    source.value.connect(context.value.destination);
    source.value.loop = true;
}

const bakeBeatSound = (buffer, metronomSoundBuffer, beatFrameCount, frameIndex, stressBeat) => {
    let j = 0;
    let start = frameIndex;
    let end = frameIndex + beatFrameCount;
    for (let i = start; i < end; i++) {
        if (j >= metronomSoundBuffer.length) {
            break
        }
        buffer[i] = buffer[i] + metronomSoundBuffer[j] / (stressBeat ? 1 : stressedVolumeRatio.value)
        j++;
    }
}

onUnmounted(() => {
    context.value?.close()
})
</script>

<template>
    <div class="metronome__work-view flex flex-col gap-4">
        <div class="flex-auto">
            <div class="w-56">
                <Checkbox v-model="stressFirstBeat" :binary="true" inputId="stressFirstBeat" name="stressFirstBeat" />
                <label for="stressFirstBeat" class="ml-2">Stress first beat</label>
            </div>
        </div>
        <div class="flex">
            <div class="w-56">
                <label for="bpm" class="font-bold block mb-2">BPM</label>
                <InputNumber v-model="bpm" class="mb-4" />
                <Slider v-model="bpm" class="w-56" name="bpm" :min="30" :max="300" />
            </div>
        </div>
        <div class="flex">
            <div class="w-56">
                <label for="repeats" class="font-bold block mb-2"> Time signature </label>
                <InputNumber v-model="repeats" inputId="repeats" mode="decimal" showButtons buttonLayout="horizontal"
                    :min="1" :max="12" class="w-48" fluid>
                    <template #incrementbuttonicon>
                        <span class="pi pi-plus" />
                    </template>
                    <template #decrementbuttonicon>
                        <span class="pi pi-minus" />
                    </template>
                </InputNumber>
            </div>
        </div>
        <button @click="handlePlayButtonClicked">{{ isPlaying ? 'Stop' : 'Play' }}</button>
    </div>
</template>