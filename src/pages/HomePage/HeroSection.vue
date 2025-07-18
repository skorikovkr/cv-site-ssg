<script setup>
import { ref, onMounted } from 'vue'
import { Loader } from '@/components/ui/loader'

const i = ref(0)
const j = ref(0)
const k = ref(0)
const title = ref('skorikovkr')
const code1 = ref('')
const code2 = ref('')
const fullTitleText = 'skorikovkr'
const fullCode1Text =
  '[HttpGet]\npublic IActionResult Get()\n{\n\treturn Ok("Frontend developer");\n}'
const fullCode2Text =
  '.text-gradient {\n\tbackground-image: linear-gradient(45deg, #2fff9e, #2a38ff);\n\tbackground-size: 100%;\n\tbackground-repeat: repeat;\n\tbackground-clip: text;\n\t-webkit-text-fill-color: transparent;\n}'
const carriage2Visibility = ref('none')
const carriage3Visibility = ref('none')
const typingDelay = 70
const isFakeLoading = ref(true)
const isGradientApplied = ref(false)

function titleWriter() {
  if (i.value < fullTitleText.length) {
    title.value += fullTitleText.charAt(i.value)
    i.value += 1
    setTimeout(titleWriter, typingDelay)
  } else {
    carriage2Visibility.value = 'inline'
    code1Writer()
  }
}

function code1Writer() {
  if (j.value < fullCode1Text.length) {
    code1.value += fullCode1Text.charAt(j.value)
    j.value += 1
    setTimeout(code1Writer, typingDelay / 5)
  } else {
    carriage2Visibility.value = 'none'
    carriage3Visibility.value = 'inline'
    isFakeLoading.value = false
    code2Writer()
  }
}

function code2Writer() {
  if (k.value < fullCode2Text.length) {
    code2.value += fullCode2Text.charAt(k.value)
    k.value += 1
    setTimeout(code1Writer, typingDelay / 10)
  } else {
    carriage3Visibility.value = 'none'
    isGradientApplied.value = true
  }
}

onMounted(() => {
  title.value = ''
  titleWriter()
})
</script>

<template>
  <section class="hero-section container mx-auto">
    <ClientOnly>
      <div class="flex justify-between flex-col-reverse xl:flex-row mt-10 max-w-7xl">
        <div class="flex flex-col gap-4 xl:min-w-[630px]">
          <div class="bg-[#18181B] rounded-lg">
            <div
              class="text-end text-slate-200 font-medium text-md px-2 py-1 border-b-[1px] border-slate-400"
            >
              C#
            </div>
            <pre
              class="font-mono text-slate-200 font-bold text-sm md:text-base p-4 text-wrap overflow-hidden min-h-[150px] xl:max-h-[160px] xl:min-h-[160px]">{{ code1 }}<span
:style="{ display: carriage2Visibility }"
                            class="h-12 ml-1 border-r-2 border-white"
          /></pre>
          </div>
          <div class="bg-[#18181B] rounded-lg">
            <div
              class="text-end text-slate-200 font-medium text-md px-2 py-1 border-b-[1px] border-slate-400"
            >
              CSS
            </div>
            <pre
              class="font-mono text-slate-200 font-bold text-sm md:text-base p-4 text-wrap overflow-hidden min-h-[206px] xl:max-h-[210px] xl:min-h-[210px]">{{ code2 }}<span
:style="{ display: carriage3Visibility }"
                            class="h-12 ml-1 border-r-2 border-white"
          /></pre>
          </div>
        </div>
        <div class="flex justify-center items-center xl:items-end flex-col mb-12 xl:mb-0">
          <div>
            <h1 class="block blog-title text-5xl font-bold text-center xl:text-end font-mono">
              {{ title }}
              <span class="h-12 ml-1 border-r-4 border-black dark:border-white blinking" />
            </h1>
          </div>
          <div class="min-h-[38px] flex flex-col justify-center xl:justify-end">
            <div
              v-if="isFakeLoading"
              class="flex justify-center xl:justify-end"
            >
              <Loader
                class=""
                size="32px"
              />
            </div>
            <p
              v-else
              class="text-2xl text-center xl:text-end"
            >
              Frontend
              <span
                class="font-bold"
                :class="{ 'text-gradient': isGradientApplied }"
              >
                developer
              </span>
            </p>
            <a
              href="#contacts"
              class="block text-xl text-center xl:text-end text-gray-400 font-semibold underline"
            >
              // goto contacts
            </a>
          </div>
        </div>
      </div>
    </ClientOnly>
  </section>
</template>

<style scoped>
li {
  margin-left: 2rem;
}

.blinking {
  animation: blink-animation 0.5s step-end infinite alternate;
}

@keyframes blink-animation {
  50% {
    border-color: transparent;
  }
}

.text-gradient {
  background-image: linear-gradient(45deg, #2fff9e, #2a38ff);
  background-size: 100%;
  background-repeat: repeat;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
}
</style>
