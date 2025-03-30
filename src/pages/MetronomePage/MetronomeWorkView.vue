<script setup>
import { ref, shallowRef, onUnmounted, watch } from 'vue'
import { debounce } from '@/utils/debounce'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Pause, Play } from 'lucide-vue-next'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'

const context = shallowRef(null)
const gainNode = shallowRef()
const buffer = shallowRef(null)
const beatsCirclesTimer = shallowRef()
const timeSignatureSoundTimer = shallowRef()
const bakedBuffer = shallowRef(null)
const isPlaying = ref(false)
const volume = ref(50)
const source = shallowRef(null)
const stressedVolumeRatio = ref(5)
const bpm = ref(100)
const repeats = ref(2)
//const length = ref(4);
const currentBeat = ref(null)
const repeatTimeSignatures = ref()
const error = ref(false)
const stressedBeats = ref(new Set([0]))

// we are not creating AudioContext in OnMounted hook because we wait any user gesture
const initContext = async () => {
  context.value = new AudioContext({
    sampleRate: 32000,
  })
  gainNode.value = context.value.createGain()
  gainNode.value.gain.value = volume.value / 100
  gainNode.value.connect(context.value.destination)
  try {
    const response = await fetch('sounds/metronome.wav')
    buffer.value = await context.value.decodeAudioData(await response.arrayBuffer())
  } catch (err) {
    console.error(`Unable to fetch the audio file. Error: ${err.message}`)
    error.value = true
  }
}

const setBeatCirclesTimer = () => {
  beatsCirclesTimer.value = setTimeout(
    () => {
      currentBeat.value = currentBeat.value == repeats.value ? 1 : currentBeat.value + 1
      clearTimeout(beatsCirclesTimer.value)
      setBeatCirclesTimer()
    },
    (60 / bpm.value) * 1000,
  )
}

const setTimeSignatureSoundTimer = () => {
  source.value?.stop()
  clearBeatCirclesTimer()
  changeAudioSource()
  source.value.start()
  currentBeat.value = 1
  setBeatCirclesTimer()
  timeSignatureSoundTimer.value = setTimeout(
    () => {
      clearTimeout(timeSignatureSoundTimer.value)
      setTimeSignatureSoundTimer()
    },
    (60 / bpm.value) * repeatTimeSignatures.value * repeats.value * 1000,
  )
}

const clearBeatCirclesTimer = () => {
  if (beatsCirclesTimer.value) clearTimeout(beatsCirclesTimer.value)
  currentBeat.value = null
}

const clearTimeSignatureSoundTimer = () => {
  if (timeSignatureSoundTimer.value) clearTimeout(timeSignatureSoundTimer.value)
  clearBeatCirclesTimer()
}

const handlePlayButtonClicked = async () => {
  if (!context.value || !buffer.value) {
    await initContext()
  }
  if (!bakedBuffer.value) bakeBuffer()
  if (isPlaying.value) {
    source.value?.stop()
    isPlaying.value = false
    clearTimeSignatureSoundTimer()
  } else {
    setTimeSignatureSoundTimer()
    isPlaying.value = true
  }
}

const updateSettings = debounce(async () => {
  if (!context.value) await initContext()
  bakeBuffer()
  if (isPlaying.value) {
    clearTimeSignatureSoundTimer()
    setTimeSignatureSoundTimer()
  }
}, 500)

watch(
  [stressedBeats, bpm, repeats],
  () => {
    clearTimeSignatureSoundTimer()
    updateSettings()
  },
  {
    deep: true,
  },
)

watch([volume], () => {
  gainNode.value.gain.value = volume.value / 100
})

const changeAudioSource = () => {
  source.value = context.value.createBufferSource()
  source.value.buffer = bakedBuffer.value
  source.value.connect(gainNode.value).connect(context.value.destination)
}

const bakeBuffer = () => {
  const beatDuration = 60 / bpm.value
  // helps to synchronize timer with sound source
  // they are desynchronized approximately in 5 second
  // so I want repeat it frequetly, but not too much (in this case time for creating new timer starts to come out)
  repeatTimeSignatures.value = Math.max(1, Math.floor(5 / (beatDuration * repeats.value))) // repeat one time or N times to fill 5 sec
  const frameCount = Math.floor(
    context.value.sampleRate * beatDuration * repeatTimeSignatures.value * repeats.value,
  )
  const beatsSoundBuffer = context.value.createBuffer(2, frameCount, context.value.sampleRate)
  const metronomSoundBuffer = buffer.value.getChannelData(0) // current sound is mono, so first and only channel with index 0
  const beatWithSilenceFrameCount = Math.floor(
    frameCount / repeatTimeSignatures.value / repeats.value,
  )
  for (let channel = 0; channel < 2; channel++) {
    let beatIndex = 0
    const nowBuffering = beatsSoundBuffer.getChannelData(channel)
    for (let i = 0; i < frameCount; i++) {
      if (i % beatWithSilenceFrameCount == 0) {
        bakeBeatSound(
          nowBuffering,
          metronomSoundBuffer,
          i,
          stressedBeats.value.has(beatIndex % repeats.value),
        )
        beatIndex++
      }
    }
  }
  bakedBuffer.value = beatsSoundBuffer
}

const bakeBeatSound = (buffer, metronomSoundBuffer, frameIndex, stressBeat) => {
  let j = 0
  const start = frameIndex
  const end = frameIndex + metronomSoundBuffer.length
  for (let i = start; i < end; i++) {
    if (j >= metronomSoundBuffer.length) {
      break
    }
    buffer[i] = buffer[i] + metronomSoundBuffer[j] / (stressBeat ? 1 : stressedVolumeRatio.value)
    j++
  }
}

const handleBeatCircleClick = (beatCircleIndex) => {
  if (stressedBeats.value.has(beatCircleIndex)) stressedBeats.value.delete(beatCircleIndex)
  else stressedBeats.value.add(beatCircleIndex)
}

onUnmounted(() => {
  context.value?.close()
  if (beatsCirclesTimer.value) clearTimeout(beatsCirclesTimer.value)
  if (timeSignatureSoundTimer.value) clearTimeout(timeSignatureSoundTimer.value)
})
</script>

<template>
  <div class="metronome__work-view flex flex-col md:flex-row gap-4">
    <div class="metronome__control-panel flex flex-col w-full md:w-64 gap-2">
      <div class="border-slate-200 dark:border-slate-100 border-b-[1px] pb-3">
        <label
          for="bpm"
          class="font-bold block mb-2"
          >BPM</label
        >
        <NumberField
          v-model="bpm"
          id="bpm"
          class="mb-4"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <div class="flex items-center">
          <div class="metronome__bpm-lower-bound-label mr-2 text-sm">30</div>
          <Slider
            :model-value="[bpm]"
            :default-value="[30]"
            :max="300"
            :min="30"
            :step="1"
            name="bpm"
            @update:model-value="(v) => (bpm = v[0])"
            class="w-full mr-4"
          />
          <div class="metronome__bpm-upper-bound-label text-sm">300</div>
        </div>
      </div>
      <div class="border-slate-200 dark:border-slate-100 border-b-[1px] pb-3">
        <label
          for="repeats"
          class="font-bold block mb-2"
        >
          Time signature
        </label>
        <NumberField
          v-model="repeats"
          :min="1"
          :max="12"
          id="bpm"
          class="mb-4"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>
      <div class="border-slate-200 dark:border-slate-100 border-b-[1px] pb-5 mb-3">
        <label
          for="bpm"
          class="font-bold block mb-2"
          >Volume</label
        >
        <div class="flex items-center">
          <Slider
            :model-value="[volume]"
            :max="200"
            :min="0"
            :step="1"
            name="volume"
            @update:model-value="(v) => (volume = v[0])"
          />
        </div>
      </div>
      <div class="flex justify-center">
        <Button @click="handlePlayButtonClicked">
          <Pause v-if="isPlaying" />
          <Play v-else />
          <span>{{ isPlaying ? 'Stop' : 'Start' }}</span>
        </Button>
      </div>
    </div>
    <div
      v-if="error"
      class="text-red-500 font-bold"
    >
      Error fetching the metronome sound. Try reloading page.
    </div>
    <div
      v-else
      class="metronome__beats-circles flex justify-center items-center w-full min-h-7"
    >
      <div class="flex gap-1 justify-center items-center">
        <div
          v-for="b in repeats"
          :key="b"
          class="rounded-full border-2"
          :class="{
            'bg-red-700 border-red-700': b === currentBeat,
            'size-6 md:size-5': !stressedBeats.has(b - 1),
            'size-7 md:size-6 border-3 border-red-300': stressedBeats.has(b - 1),
          }"
          @click="() => handleBeatCircleClick(b - 1)"
        ></div>
      </div>
    </div>
  </div>
</template>
