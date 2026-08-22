<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black relative overflow-hidden">
    <!-- 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true"></div>

    <!-- 메인 콘텐츠 -->
    <div class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <header>
        <StoryHeader />
        <StoryTitle />
      </header>

      <main class="flex-1 max-w-4xl mx-auto w-full">
        <StoryContent />

        <!-- 전투 시작 버튼 -->
        <div class="text-center">
          <StoryBattleButton />
        </div>
      </main>

      <StoryFooterHint />
    </div>

    <!-- 파티클 효과 -->
    <SharedParticleEffect />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

// URL로 직접 들어와도 화면이 성립하도록 보정한다.
// idempotent한 액션이라 서버/클라이언트 양쪽에서 실행돼도 결과가 같다
// (= 하이드레이션 불일치가 생기지 않는다).
gameStore.ensureStoryReady()

// 스토리를 다 안 읽고 떠나면 진행 중인 AI 요청을 끊는다.
// 아무도 보지 않을 응답을 끝까지 받으면서 토큰을 쓰는 걸 막는다.
onBeforeUnmount(() => gameStore.abortStoryGeneration())

// SEO 설정
useHead({
  title: '스토리 - 워드 배틀',
  meta: [
    { name: 'description', content: 'AI가 생성하는 재미있는 스토리를 읽고 전투를 준비하세요!' }
  ]
})
</script>
