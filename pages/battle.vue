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

// 🔧 전투 페이지 접근 제한 (스토리에서 진입 허용)
if (gameStore.gamePhase !== 'battle' && gameStore.gamePhase !== 'story') {
  throw createError({
    statusCode: 404,
    statusMessage: '잘못된 접근입니다. 스토리를 먼저 확인해주세요.'
  })
}

// 🔧 스토리에서 전투로 진입 시 gamePhase 자동 수정
if (gameStore.gamePhase === 'story') {
  gameStore.gamePhase = 'battle'
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