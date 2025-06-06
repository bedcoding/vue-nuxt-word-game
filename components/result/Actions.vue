<template>
  <div class="space-y-3">
    <!-- 승리한 경우 -->
    <template v-if="isPlayerWin">
      <!-- 지역 완주한 경우 -->
      <template v-if="isRegionComplete">
        <button
          @click="goToMenu"
          class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          🌟 새로운 지역 도전
        </button>
      </template>
      <!-- 지역 진행 중인 경우 -->
      <template v-else>
        <button
          @click="continueAdventure"
          class="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          ➡️ 다음 단계로 ({{ gameStore.currentStageNumber + 1 }}/10)
        </button>
      </template>
    </template>
    
    <!-- 패배한 경우 -->
    <template v-else>
      <button
        @click="retryStage"
        class="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        🔄 현재 단계 재도전
      </button>
    </template>
    
    <!-- 공통 버튼들 (지역 완주가 아닐 때만 표시) -->
    <button
      v-if="!isRegionComplete"
      @click="goToMenu"
      class="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
    >
      🏠 메인 메뉴
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const isPlayerWin = computed(() => gameStore.isPlayerWin)
const isRegionComplete = computed(() => gameStore.currentStageNumber === 10 && isPlayerWin.value)

// 다음 단계 계속
const continueAdventure = async () => {
  await gameStore.nextStage()
  navigateTo('/story')
}

// 현재 단계 재도전
const retryStage = () => {
  gameStore.loadCurrentStage()
  navigateTo('/story')
}

// 메인 메뉴로
const goToMenu = () => {
  gameStore.goToMenu()
  navigateTo('/')
}
</script> 