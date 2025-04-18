<template>
  <div>
    <select
      v-model="func"
      style="width: 60px"
    >
      <option
        v-for="t in customFunctions"
        :key="t.id"
        :value="t"
      >
        {{ t.name }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue'

const functions = inject('functions')

const customFunctions = computed(() =>
  (Object.keys(functions.value).filter((f) => f !== 'main') ?? []).map((k) => functions.value[k]),
)

const props = defineProps(['node'])

const func = ref(customFunctions.value.find((f) => f.id === props.node?.options?.id))

const emits = defineEmits(['updateNode'])

watch(func, () => {
  if (func.value?.id) {
    emits('updateNode', props.node.id, {
      options: {
        id: func.value.id,
      },
      dataType: functions.value[func.value.id].output,
      inputTypes: functions.value[func.value.id].inputTypes,
      inputs: functions.value[func.value.id].inputTypes.map(() => null),
    })
  }
})
</script>
