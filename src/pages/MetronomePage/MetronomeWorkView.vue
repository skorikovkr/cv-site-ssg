<script setup>
import { ref, onMounted, shallowRef, onUnmounted } from "vue"

const context = shallowRef()
const gainNode = shallowRef()
const buffer = shallowRef()
//const isPlaying = ref(false)
const volume = ref(1)
let source;

onMounted(async () => {
    context.value = new AudioContext({
        sampleRate: 32000
    });
    gainNode.value = context.value.createGain();
    gainNode.value.gain.value = volume.value;
    gainNode.value.connect(context.value.destination);
    try {
        const response = await fetch("sounds/metronome.wav");
        context.value.decodeAudioData(await response.arrayBuffer(), (buf) => {
            buffer.value = buf;
        });
    } catch (err) {
        console.error(`Unable to fetch the audio file. Error: ${err.message}`);
    }
})

const handlePlayButtonClicked = () => {
    source = context.value.createBufferSource();
    const repeats = 2;
    const frameCount = Math.floor(context.value.sampleRate * buffer.value.duration * repeats);
    const test = context.value.createBuffer(
        2,
        frameCount,
        context.value.sampleRate
    );
    const stressFirstIndex = frameCount / 2;
    const metronomSoundBuffer = buffer.value.getChannelData(0)  // current sound is mono, so first and only channel with index 0
    for (let channel = 0; channel < 2; channel++) {
        const nowBuffering = test.getChannelData(channel)
        for (let i = 0; i < frameCount; i++) {
            nowBuffering[i] = metronomSoundBuffer[i % (frameCount / 2)] / 2  // last / 2 to lower volume temporary
            if (i < stressFirstIndex) {
                nowBuffering[i] *= 2
            }
        }
    }
    source.buffer = test;
    source.connect(context.value.destination);
    source.loop = true;
    source.start();

}

onUnmounted(() => {
    context.value.close()
})
</script>

<template>
    <div>metronome
        <button @click="handlePlayButtonClicked">Play</button>
    </div>
</template>