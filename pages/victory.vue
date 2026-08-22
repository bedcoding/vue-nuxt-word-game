<template>
  <div class="min-h-screen bg-gradient-to-b from-yellow-900 via-orange-900 to-red-900 relative overflow-hidden">
    <!-- 승리 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true"></div>

    <!-- 메인 콘텐츠 -->
    <main class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      <ResultVictoryContent />
      <ResultActions />
    </main>

    <!-- 승리 색종이 효과 -->
    <ResultBackgroundEffect variant="victory" />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

// URL로 직접 들어와도 승리 화면이 성립하도록 보정한다 (idempotent)
gameStore.ensureVictoryReady()

// SEO 설정
useHead({
  title: '승리! - 워드 배틀',
  meta: [
    { name: 'description', content: '축하합니다! 모든 적을 물리치고 승리했습니다!' }
  ]
})
</script>
