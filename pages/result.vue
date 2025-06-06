<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden flex items-center justify-center">
    <!-- 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    
    <!-- 결과 모달 -->
    <ResultModal />
    
    <!-- 승리/패배 배경 효과 -->
    <ResultBackgroundEffect />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

// 🔧 결과 페이지 접근 제한 (전투에서 진입 허용)
if (gameStore.gamePhase !== 'result' && gameStore.gamePhase !== 'battle') {
  throw createError({
    statusCode: 404,
    statusMessage: '잘못된 접근입니다. 전투를 먼저 진행해주세요.'
  })
}

// 🔧 전투에서 결과로 진입 시 gamePhase 자동 수정
if (gameStore.gamePhase === 'battle') {
  gameStore.gamePhase = 'result'
}

// SEO 설정
useHead({
  title: '결과 - 워드 배틀',
  meta: [
    { name: 'description', content: '전투 결과를 확인하고 다음 단계를 선택하세요!' }
  ]
})
</script> 