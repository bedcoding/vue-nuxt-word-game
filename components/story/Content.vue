<template>
  <div class="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-xl p-8 mb-8">
    <!-- 스토리 텍스트 -->
    <div class="prose prose-invert max-w-none">
      <div 
        v-if="currentStoryData?.content"
        v-for="(paragraph, index) in storyParagraphs"
        :key="index"
        class="mb-6 text-purple-100 leading-relaxed typing-effect"
        :class="{ 'opacity-0 animate-fade-in': isAnimating && index > currentParagraph }"
        :style="{ animationDelay: index * 0.2 + 's' }"
      >
        {{ paragraph }}
      </div>
      
      <!-- 스토리가 아직 없을 때 -->
      <div v-else class="text-center py-8">
        <div class="text-2xl mb-4 animate-pulse">✨</div>
        <div class="text-purple-300 animate-pulse">AI가 스토리를 생성하는 중...</div>
      </div>
    </div>
    
    <!-- 적 정보 미리보기 -->
    <StoryEnemyPreview v-if="currentStage" :stage="currentStage" />
    
    <!-- 단어 미리보기 -->
    <StoryWordPreview v-if="currentStage" :words="currentStage.words" />
    
    <!-- 단계별 보상 정보 -->
    <StoryRewardInfo />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const isAnimating = ref(true)
const currentParagraph = ref(0)

const currentStage = computed(() => gameStore.currentStage)
const currentStoryData = computed(() => gameStore.currentStoryData)

const storyParagraphs = computed(() => {
  if (!currentStoryData.value?.content) return []
  return currentStoryData.value.content.split('\n').filter(p => p.trim())
})

onMounted(() => {
  // 타이핑 애니메이션 효과
  setTimeout(() => {
    isAnimating.value = false
  }, 3000)
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.typing-effect {
  /* 타이핑 효과는 제거하고 페이드인만 유지 */
}

/* 타이핑 애니메이션 제거됨 */
</style> 