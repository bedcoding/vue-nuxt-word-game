<template>
  <div class="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-600/30 rounded-lg p-4 mb-6">
    <div class="text-sm text-gray-300 mb-2">
      {{ currentRegion?.title }} - {{ gameStore.currentStageNumber }}/10 단계
    </div>
    <div class="flex items-center justify-center gap-2 mb-2">
      <div class="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
          :style="{ width: gameStore.progressPercentage + '%' }"
        ></div>
      </div>
      <span class="text-xs text-purple-300">{{ Math.round(gameStore.progressPercentage) }}%</span>
    </div>
    <div class="text-xs text-gray-400">
      {{ isRegionComplete ? '지역 완료!' : `${10 - gameStore.currentStageNumber}단계 남음` }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const currentRegion = computed(() => gameStore.currentRegion)
const isRegionComplete = computed(() => gameStore.currentStageNumber === 10 && gameStore.isPlayerWin)
</script> 