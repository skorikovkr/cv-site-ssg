<template>
  <div class="node-select">
    <Label class="text-xs"><slot name="label"></slot></Label>
    <Select v-model:model-value="modelValue">
      <SelectTrigger class="bg-background p-1 px-2 h-auto">
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="t in options"
            :key="t.key"
            :value="t.value"
          >
            {{ t.label }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AcceptableValue } from 'reka-ui'

const modelValue = defineModel<AcceptableValue | AcceptableValue[] | undefined>()

defineProps<{
  options: {
    key: string | number
    value: AcceptableValue
    label: string | number
  }[]
  placeholder?: string
}>()
</script>
