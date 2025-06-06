<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black relative overflow-hidden">
    <!-- 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    
    <!-- 메인 콘텐츠 -->
    <div class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <!-- 헤더 -->
      <StoryHeader />
      
      <!-- 스토리 제목 -->
      <StoryTitle />
      
      <!-- 스토리 콘텐츠 -->
      <div class="flex-1 max-w-4xl mx-auto w-full">
        <StoryContent />
        
        <!-- 전투 시작 버튼 -->
        <div class="text-center">
          <StoryBattleButton />
        </div>
      </div>
      
      <!-- 하단 힌트 -->
      <StoryFooterHint />
    </div>
    
    <!-- 파티클 효과 -->
    <StoryParticleEffect />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

// 🔧 스토리 페이지 접근 제한 (재도전 및 전투 뒤로가기 허용)
if (gameStore.gamePhase !== 'story' && gameStore.gamePhase !== 'result' && gameStore.gamePhase !== 'battle') {
  throw createError({
    statusCode: 404,
    statusMessage: '잘못된 접근입니다. 메인 메뉴에서 게임을 시작해주세요.'
  })
}

// 🔧 다른 상태에서 스토리로 진입 시 gamePhase 자동 수정
if (gameStore.gamePhase === 'result' || gameStore.gamePhase === 'battle') {
  gameStore.gamePhase = 'story'
}

// SEO 설정
useHead({
  title: '스토리 - 워드 배틀',
  meta: [
    { name: 'description', content: 'AI가 생성하는 재미있는 스토리를 읽고 전투를 준비하세요!' }
  ]
})
</script> 