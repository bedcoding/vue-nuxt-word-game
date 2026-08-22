<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-red-900 to-black relative overflow-hidden">
    <!-- 패배 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true"></div>

    <!-- 메인 콘텐츠 -->
    <main class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      <ResultDefeatContent />
      <ResultActions />
    </main>

    <!-- 패배 배경 효과 (어둠) -->
    <ResultBackgroundEffect variant="defeat" />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

// URL로 직접 들어와도 패배 화면이 성립하도록 보정한다 (idempotent)
gameStore.ensureDefeatReady()

// SEO 설정
useHead({
  title: '패배 - 워드 배틀',
  meta: [
    { name: 'description', content: '아쉽게도 패배했습니다. 다시 도전해보세요!' }
  ]
})
</script>
