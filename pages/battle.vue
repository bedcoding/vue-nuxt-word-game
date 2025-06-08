<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black relative overflow-hidden">
    <!-- 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    
    <!-- 메인 콘텐츠 -->
    <div class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <!-- 헤더 (뒤로가기 + 진행상황) -->
      <div class="mb-6 flex items-center justify-between">
        <SharedBackButton to="/story" />
        
        <!-- 진행 상황 표시 -->
        <SharedProgressBar
          :title="currentRegion?.title || ''"
          :current-stage="gameStore.currentStageNumber"
          :total-stages="10"
          :percentage="gameStore.progressPercentage"
        />
      </div>
      
      <!-- 전투 제목 -->
      <div class="text-center mb-8">
        <div class="text-4xl mb-4">⚔️</div>
        <h1 class="text-4xl font-bold text-white mb-2">
          {{ currentStage?.storyTitle || '도서관 입구' }}
        </h1>
        <div class="text-lg text-purple-300 mb-4">{{ currentStage?.enemy.name || '작은 정령' }}</div>
        <div class="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded"></div>
      </div>
      
      <!-- 전투 화면 -->
      <div class="flex-1 max-w-6xl mx-auto w-full">
        <BattleField @battle-log="addBattleLog" />
        
        <!-- 전투 로그 -->
        <BattleLog ref="battleLogRef" />
      </div>
    </div>
    
    <!-- 파티클 효과 -->
    <SharedParticleEffect />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const battleLogRef = ref()

const currentRegion = computed(() => gameStore.currentRegion)
const currentStage = computed(() => gameStore.currentStage)

// 🔧 전투 페이지: 관대한 접근 정책 (강제 리다이렉트 없음)
// 어떤 상태든 전투 페이지 접근 허용하고 적절히 초기화

// gamePhase가 menu인 경우 기본 게임 상태로 초기화
if (gameStore.gamePhase === 'menu') {
  // 기본 지역과 스테이지 설정
  if (!gameStore.selectedRegion) {
    gameStore.selectedRegion = 1
  }
  if (gameStore.currentStageNumber === 0) {
    gameStore.currentStageNumber = 1
  }
  gameStore.loadCurrentStage()
  gameStore.gamePhase = 'battle'
  gameStore.isGameOver = false
  gameStore.isPlayerTurn = true
  gameStore.generateNewQuestion()
}

// 다른 상태에서도 자연스럽게 전투로 전환
if (gameStore.gamePhase !== 'battle') {
  gameStore.gamePhase = 'battle'
  if (!gameStore.isGameOver) {
    gameStore.isPlayerTurn = true
    gameStore.generateNewQuestion()
  }
}

// 전투 로그 추가 함수
const addBattleLog = (message: string) => {
  if (battleLogRef.value) {
    battleLogRef.value.addBattleLog(message)
  }
}

// SEO 설정
useHead({
  title: '전투 - 워드 배틀',
  meta: [
    { name: 'description', content: '영어 단어를 맞춰서 적을 물리치세요!' }
  ]
})
</script> 