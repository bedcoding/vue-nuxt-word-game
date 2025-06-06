<template>
  <div class="relative z-10 bg-black/60 backdrop-blur-lg border border-purple-400/50 rounded-2xl p-8 max-w-lg w-full mx-4 text-center">
    <!-- 결과 아이콘 -->
    <div class="text-8xl mb-6 animate-bounce">
      {{ getResultIcon() }}
    </div>
    
    <!-- 결과 제목 -->
    <h2 class="text-4xl font-bold mb-4" :class="getResultColor()">
      {{ getResultTitle() }}
    </h2>
    
    <!-- 결과 메시지 -->
    <p class="text-lg text-purple-200 mb-6">
      {{ getResultMessage() }}
    </p>
    
    <!-- 진행 상황 표시 -->
    <ResultProgress />
    
    <!-- 점수 표시 -->
    <ResultScore />
    
    <!-- 적 정보 -->
    <ResultEnemyInfo />
    
    <!-- 액션 버튼들 -->
    <ResultActions />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

// 승리 여부
const isPlayerWin = computed(() => gameStore.isPlayerWin)

// 현재 지역과 단계
const currentRegion = computed(() => gameStore.currentRegion)
const currentStage = computed(() => gameStore.currentStage)

// 지역 완주 여부
const isRegionComplete = computed(() => gameStore.currentStageNumber === 10 && isPlayerWin.value)

// 결과 아이콘
const getResultIcon = () => {
  if (!isPlayerWin.value) return '💀'
  if (isRegionComplete.value) return '🏆'
  return '🎉'
}

// 결과 제목
const getResultTitle = () => {
  if (!isPlayerWin.value) return '패배!'
  if (isRegionComplete.value) return '지역 완주!'
  return '단계 클리어!'
}

// 결과 색상
const getResultColor = () => {
  if (!isPlayerWin.value) return 'text-red-400'
  if (isRegionComplete.value) return 'text-yellow-400'
  return 'text-green-400'
}

// 결과 메시지
const getResultMessage = () => {
  if (!isPlayerWin.value) {
    return `${currentStage.value?.enemy.name}에게 패배했습니다...\n더 열심히 공부하고 다시 도전하세요!`
  }
  
  if (isRegionComplete.value) {
    return `축하합니다! ${currentRegion.value?.title}의 모든 단계를 클리어했습니다!\n최종 보스까지 물리친 진정한 영어 마스터입니다!`
  }
  
  return `${currentStage.value?.enemy.name} 처치!\n다음 단계로 계속 모험을 떠나보세요!`
}
</script> 