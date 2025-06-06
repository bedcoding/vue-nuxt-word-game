<template>
  <div class="min-h-screen bg-gradient-to-b from-yellow-900 via-orange-900 to-red-900 relative overflow-hidden">
    <!-- 승리 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    
    <!-- 메인 콘텐츠 -->
    <div class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      <ResultHeader />
      <ResultVictoryContent />
      <ResultActions />
    </div>
    
    <!-- 승리 파티클 효과 -->
    <ResultConfetti />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

// 🔧 승리 페이지: 관대한 접근 정책
// 직접 URL 접근 허용, 기본 승리 상태 설정
if (gameStore.gamePhase !== 'victory') {
  // 기본 승리 상태로 설정
  gameStore.gamePhase = 'victory'
  if (gameStore.currentStageNumber < 10) {
    gameStore.currentStageNumber = 10
  }
  if (gameStore.player.hp <= 0) {
    gameStore.player.hp = 1 // 최소 체력
  }
}

// SEO 설정
useHead({
  title: '승리! - 워드 배틀',
  meta: [
    { name: 'description', content: '축하합니다! 모든 적을 물리치고 승리했습니다!' }
  ]
})
</script> 