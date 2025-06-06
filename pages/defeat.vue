<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-red-900 to-black relative overflow-hidden">
    <!-- 패배 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    
    <!-- 메인 콘텐츠 -->
    <div class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      <ResultHeader />
      <ResultDefeatContent />
      <ResultActions />
    </div>
    
    <!-- 패배 파티클 효과 (어둠) -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full opacity-50 animate-pulse"></div>
      <div class="absolute top-3/4 right-1/4 w-1 h-1 bg-red-400 rounded-full opacity-30 animate-pulse delay-500"></div>
      <div class="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-red-600 rounded-full opacity-40 animate-pulse delay-1000"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

// 🔧 패배 페이지: 관대한 접근 정책
// 직접 URL 접근 허용, 기본 패배 상태 설정
if (gameStore.gamePhase !== 'defeat') {
  // 기본 패배 상태로 설정
  gameStore.gamePhase = 'defeat'
  if (gameStore.player.hp > 0) {
    gameStore.player.hp = 0 // 패배 상태
  }
}

// SEO 설정
useHead({
  title: '패배... - 워드 배틀',
  meta: [
    { name: 'description', content: '아쉽게도 패배했습니다. 다시 도전해보세요!' }
  ]
})
</script> 