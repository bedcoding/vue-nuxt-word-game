<template>
  <button
    @click="startBattle"
    :disabled="!gameStore.currentStoryData?.content"
    class="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl"
  >
    {{ 
      !gameStore.currentStoryData?.content ? '스토리 생성 대기 중...' :
      gameStore.isBossStage ? '👑 최종 결전 시작!' : '⚔️ 전투 시작' 
    }}
  </button>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const startBattle = () => {
  gameStore.startBattle()
  navigateTo('/battle')
}
</script> 