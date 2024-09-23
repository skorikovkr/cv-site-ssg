<script setup>
import { ref, onMounted, shallowRef, onUnmounted } from "vue"

const context = shallowRef()
const gainNode = shallowRef()
const buffer = shallowRef()
//const isPlaying = ref(false)
const volume = ref(0.1)
let source;

onMounted(async () => {
    context.value = new AudioContext();
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
    source.buffer = buffer.value;
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