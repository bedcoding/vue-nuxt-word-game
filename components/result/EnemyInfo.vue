<template>
  <div class="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4 mb-6">
    <div class="flex items-center justify-center gap-3 mb-2">
      <span class="text-2xl">{{ currentStage?.stage === 10 ? '👹' : '👾' }}</span>
      <span class="text-white font-semibold">{{ currentStage?.enemy.name }}</span>
    </div>
    <div class="text-sm text-gray-400">
      {{ currentStage?.storyTitle }} - {{ isPlayerWin ? '클리어!' : '도전 실패' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const currentStage = computed(() => gameStore.currentStage)
const isPlayerWin = computed(() => gameStore.isPlayerWin)
</script> 