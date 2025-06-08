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
    <SharedParticleEffect />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

// 🔧 스토리 페이지: 관대한 접근 정책 (강제 리다이렉트 없음)
// 어떤 상태든 스토리 페이지 접근 허용하고 적절히 초기화

// gamePhase가 menu인 경우 기본 게임 상태로 초기화
if (gameStore.gamePhase === 'menu') {
  // 기본 지역과 스테이지 설정 (강제 리다이렉트 대신)
  if (!gameStore.selectedRegion) {
    gameStore.selectedRegion = 1 // 기본 지역
  }
  if (gameStore.currentStageNumber === 0) {
    gameStore.currentStageNumber = 1 // 기본 스테이지
  }
  gameStore.gamePhase = 'story'
  gameStore.loadCurrentStage()
}

// 다른 상태에서도 자연스럽게 스토리로 전환
if (gameStore.gamePhase !== 'story') {
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