<template>
  <div class="flex justify-between items-center mb-6">
    <button
      @click="goBackToStory"
      class="bg-gray-800/80 hover:bg-gray-700/80 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
    >
      ← 뒤로가기
    </button>
    
    <div class="text-center">
      <h1 class="text-3xl font-bold text-white drop-shadow-lg">
        ⚔️ {{ currentStage?.storyTitle }} ⚔️
      </h1>
      <p class="text-white opacity-80">{{ currentStage?.enemy.name }}</p>
    </div>
    
    <div class="w-24"></div> <!-- 균형을 위한 공간 -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const currentStage = computed(() => gameStore.currentStage)

// 🔧 스토리로 안전하게 돌아가기
const goBackToStory = () => {
  gameStore.goToStory()
}
</script> 