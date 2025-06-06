<template>
  <button
    @click="$emit('start')"
    :disabled="!selectedRegionId"
    class="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl"
  >
    <span v-if="!selectedRegionId">지역을 선택하세요</span>
    <span v-else>🚀 모험 시작 </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  selectedRegionId: number | null
}

defineProps<Props>()
defineEmits<{
  start: []
}>()
</script> 