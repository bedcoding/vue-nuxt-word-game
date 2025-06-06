<template>
  <div class="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg px-4 py-2">
    <div class="text-white text-sm font-bold">
      {{ title }} - {{ currentStage }}/{{ totalStages }} 단계
    </div>
    <div class="flex items-center gap-1 mt-1">
      <div class="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
          :style="{ width: percentage + '%' }"
        ></div>
      </div>
      <span class="text-xs text-purple-300 ml-2">{{ Math.round(percentage) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  currentStage: number
  totalStages: number
  percentage: number
}

defineProps<Props>()
</script> 