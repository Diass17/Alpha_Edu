<template>
  <div class="relative w-full">
    <button
      class="w-full flex justify-between items-center px-4 py-2 border border-purple-200 rounded-lg bg-white shadow-sm hover:border-[#6252FE] transition"
      @click="toggleDropdown"
      type="button"
    >
      <span :class="selected ? 'text-[#000000] font-semibold' : 'text-gray-500'">{{ selected || placeholder }}</span>
      <svg class="w-14 h-4 ml-2 transition-transform" :class="{ 'rotate-180': show }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>
    <ul
      v-if="show"
      class="absolute z-50 mt-2 w-full bg-white border border-purple-200 rounded-lg shadow-lg"
    >
      <li
        v-for="option in options"
        :key="option"
        @click="selectOption(option)"
        class="cursor-pointer px-4 py-2 hover:bg-[#F1EFFF] transition"
        :class="{ 'text-[#6252FE] font-medium': selected === option }"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  modelValue: string
  options: string[]
  placeholder?: string
}>()
const emit = defineEmits(['update:modelValue'])

const show = ref(false)
const selected = ref(props.modelValue)

watch(() => props.modelValue, val => selected.value = val)
onMounted(() => { selected.value = props.modelValue })

function toggleDropdown() {
  show.value = !show.value
}
function selectOption(option: string) {
  emit('update:modelValue', option)
  show.value = false
}

// Optional: close dropdown on click outside
function onClickOutside(event: MouseEvent) {
  if (!(event.target as HTMLElement).closest('.relative')) show.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>