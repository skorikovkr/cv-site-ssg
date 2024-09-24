<script setup>
import { ref, onMounted, shallowRef, onUnmounted } from "vue"

const context = shallowRef()
const gainNode = shallowRef()
const buffer = shallowRef()
//const isPlaying = ref(false)
const volume = ref(1)
let source = null;

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
    if (source)
        source.stop();
    source = context.value.createBufferSource();
    const repeats = 2;
    const bpm = 220;  // 200 and higher is bugged. No stress first beat and approx 2 times slower than intended 
    const beatDuration = 60 / bpm;
    const frameCount = context.value.sampleRate * beatDuration * repeats;
    const beatsSoundBuffer = context.value.createBuffer(
        2,
        frameCount,
        context.value.sampleRate
    );
    const metronomSoundBuffer = buffer.value.getChannelData(0)  // current sound is mono, so first and only channel with index 0
    const beatFrameCount = metronomSoundBuffer.length;
    const beatWithSilenceFrameCount = frameCount / repeats;
    console.log({
        repeats, bpm, beatDuration, frameCount, beatFrameCount, beatWithSilenceFrameCount
    });
    for (let channel = 0; channel < 2; channel++) {
        let isFirst = true;
        const nowBuffering = beatsSoundBuffer.getChannelData(channel)
        for (let i = 0; i < frameCount; i++) {
            if (i % beatWithSilenceFrameCount == 0) {
                bakeBeatSound(nowBuffering, metronomSoundBuffer, beatFrameCount, i, isFirst)
                isFirst = false;
            }
        }
    }
    source.buffer = beatsSoundBuffer;
    source.connect(context.value.destination);
    source.loop = true;
    source.start();
}

const bakeBeatSound = (buffer, metronomSoundBuffer, beatFrameCount, frameIndex, stressBeat) => {
    let j = 0;
    let start = frameIndex;
    let end = frameIndex + beatFrameCount;
    for (let i = start; i < end; i++) {
        if (j >= metronomSoundBuffer.length) {
            break
        }
        if (i >= buffer.length) {
            i = 0;
            end = metronomSoundBuffer.length - j;
        }
        buffer[i] = buffer[i] + metronomSoundBuffer[j] / (stressBeat ? 1 : 10)  // last / 4 to lower volume temporary for developing
        j++;
    }
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