<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 via-pink-500 to-red-500 p-4">
    <div class="container mx-auto max-w-6xl">
      <!-- 상단 네비게이션 -->
      <BattleHeader />
      
      <!-- 전투 화면 -->
      <BattleField @battle-log="addBattleLog" />
      
      <!-- 전투 로그 -->
      <BattleLog ref="battleLogRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const battleLogRef = ref()

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