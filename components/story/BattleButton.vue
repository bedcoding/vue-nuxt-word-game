<template>
  <button
    type="button"
    :disabled="!isReady"
    class="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'
import { useGameFlow } from '@/composables/useGameFlow'

const gameStore = useGameStore()
const flow = useGameFlow()

const isReady = computed(() => Boolean(gameStore.currentStoryData?.content))

const label = computed(() => {
  if (!isReady.value) return '스토리 생성 대기 중...'
  return gameStore.isBossStage ? '👑 최종 결전 시작!' : '⚔️ 전투 시작'
})

const onClick = (): void => {
  void flow.startBattle()
}
</script>
