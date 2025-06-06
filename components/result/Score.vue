<template>
  <div class="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-400/30 rounded-lg p-4 mb-6">
    <div class="text-sm text-blue-300 mb-1">최종 점수</div>
    <div class="text-3xl font-bold text-white">{{ gameStore.score }}점</div>
    
    <!-- 보스 클리어 보너스 표시 -->
    <div v-if="isRegionComplete && isPlayerWin" class="mt-2">
      <div class="text-xs text-yellow-300">👑 지역 완주 보너스: +100점!</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const isPlayerWin = computed(() => gameStore.isPlayerWin)
const isRegionComplete = computed(() => gameStore.currentStageNumber === 10 && isPlayerWin.value)
</script> 