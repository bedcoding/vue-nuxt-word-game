<template>
  <div class="text-center mb-8">
    <div class="text-4xl mb-4">{{ getStoryIcon(currentRegion?.id) }}</div>
    <h1 class="text-4xl font-bold text-white mb-2">
      {{ currentStoryData?.storyTitle || '스토리 생성 중...' }}
    </h1>
    <div class="text-lg text-purple-300 mb-4">{{ currentRegion?.title }}</div>
    <div class="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded"></div>
    
    <!-- AI 생성 표시 -->
    <div v-if="gameStore.aiGeneratedStory" class="mt-4">
      <div class="inline-flex items-center gap-2 bg-gradient-to-r from-green-600/80 to-blue-600/80 text-white px-3 py-1 rounded-full text-xs font-bold">
        🤖 AI 생성 스토리
      </div>
    </div>
    
    <!-- 스트리밍 중 표시 -->
    <div v-else-if="!currentStoryData?.content" class="mt-4">
      <div class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
        ⚡ AI가 스토리를 생성하는 중...
      </div>
    </div>
    
    <!-- 보스 단계 표시 -->
    <div v-if="gameStore.isBossStage" class="mt-4">
      <div class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/80 to-orange-600/80 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
        👑 최종 보스전 👑
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const currentRegion = computed(() => gameStore.currentRegion)
const currentStoryData = computed(() => gameStore.currentStoryData)

// 스토리 아이콘
const getStoryIcon = (regionId?: number): string => {
  const icons: Record<number, string> = {
    1: '📚', // 마법 도서관
    2: '🌀', // 시간의 미로
    3: '🏰'  // 어둠의 성
  }
  return icons[regionId || 1] || '⚔️'
}
</script> 