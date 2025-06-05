<template>
  <div>
    <!-- 메인 메뉴 -->
    <MainMenu v-if="gameStore.gamePhase === 'menu'" />
    
    <!-- 스토리 화면 -->
    <StoryScreen v-else-if="gameStore.gamePhase === 'story'" />
    
    <!-- 전투 화면 -->
    <GameBoard v-else-if="gameStore.gamePhase === 'battle'" />
    
    <!-- 결과 화면 -->
    <ResultScreen v-else-if="gameStore.gamePhase === 'result'" />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

// 게임 스토어 사용
const gameStore = useGameStore()

// 컴포넌트들이 자동으로 import
// MainMenu, StoryScreen, GameBoard, ResultScreen
</script>
