<template>
  <div class="space-y-3">
    <!-- 승리한 경우 -->
    <template v-if="isPlayerWin">
      <!-- 지역 완주 -->
      <button
        v-if="isRegionComplete"
        type="button"
        class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
        @click="onGoToMenu"
      >
        🌟 새로운 지역 도전
      </button>

      <!-- 지역 진행 중 -->
      <button
        v-else
        type="button"
        class="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
        @click="onContinue"
      >
        ➡️ 다음 단계로 ({{ nextStageNumber }}/{{ GAME_CONFIG.totalStages }})
      </button>
    </template>

    <!-- 패배한 경우 -->
    <button
      v-else
      type="button"
      class="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
      @click="onRetry"
    >
      🔄 현재 단계 재도전
    </button>

    <!-- 공통 버튼 (지역 완주가 아닐 때만) -->
    <button
      v-if="!isRegionComplete"
      type="button"
      class="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
      @click="onGoToMenu"
    >
      🏠 메인 메뉴
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { GAME_CONFIG } from '@/constants/game.config'
import { useGameStore } from '@/stores/game'
import { useGameFlow } from '@/composables/useGameFlow'

const gameStore = useGameStore()
const flow = useGameFlow()

const isPlayerWin = computed(() => gameStore.isPlayerWin)
const isRegionComplete = computed(() => gameStore.isBossStage && isPlayerWin.value)
const nextStageNumber = computed(() =>
  Math.min(gameStore.currentStageNumber + 1, GAME_CONFIG.totalStages)
)

const onContinue = (): void => {
  void flow.continueAdventure()
}

const onRetry = (): void => {
  void flow.retryStage()
}

const onGoToMenu = (): void => {
  void flow.goToMenu()
}
</script>
