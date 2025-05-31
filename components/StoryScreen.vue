<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black relative overflow-hidden">
    <!-- 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    
    <!-- 메인 콘텐츠 -->
    <div class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <!-- 뒤로가기 버튼 -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="bg-gray-800/80 hover:bg-gray-700/80 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          ← 뒤로가기
        </button>
      </div>
      
      <!-- 스토리 제목 -->
      <div class="text-center mb-8">
        <div class="text-4xl mb-4">{{ getStoryIcon(currentStory?.id) }}</div>
        <h1 class="text-4xl font-bold text-white mb-2">{{ currentStory?.title }}</h1>
        <div class="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded"></div>
      </div>
      
      <!-- 스토리 콘텐츠 -->
      <div class="flex-1 max-w-4xl mx-auto w-full">
        <div class="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-xl p-8 mb-8">
          <!-- 스토리 텍스트 -->
          <div class="prose prose-invert max-w-none">
            <div 
              v-for="(paragraph, index) in storyParagraphs"
              :key="index"
              class="mb-6 text-purple-100 leading-relaxed"
              :class="{ 'opacity-0 animate-fade-in': isAnimating && index > currentParagraph }"
              :style="{ animationDelay: index * 0.5 + 's' }"
            >
              {{ paragraph }}
            </div>
          </div>
          
          <!-- 적 정보 미리보기 -->
          <div class="mt-8 p-6 bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-400/30 rounded-lg">
            <h3 class="text-xl font-bold text-red-200 mb-4 text-center">⚠️ 적 정보</h3>
            <div class="flex items-center justify-center gap-6">
              <div class="text-center">
                <div class="text-3xl mb-2">👾</div>
                <div class="text-white font-semibold">{{ currentStory?.enemy.name }}</div>
                <div class="text-red-300 text-sm">HP: {{ currentStory?.enemy.hp }}</div>
              </div>
              <div class="text-center">
                <div class="text-lg text-yellow-300 mb-2">vs</div>
                <div class="text-3xl mb-2">🛡️</div>
                <div class="text-white font-semibold">{{ gameStore.player.name }}</div>
                <div class="text-green-300 text-sm">HP: {{ gameStore.player.hp }}</div>
              </div>
            </div>
          </div>
          
          <!-- 단어 미리보기 -->
          <div class="mt-6 p-4 bg-blue-900/30 border border-blue-400/30 rounded-lg">
            <h4 class="text-lg font-semibold text-blue-200 mb-3 text-center">📚 출제될 단어들</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div 
                v-for="word in currentStory?.words"
                :key="word.korean"
                class="text-center p-2 bg-blue-800/30 rounded"
              >
                <div class="text-white font-medium">{{ word.korean }}</div>
                <div class="text-blue-300 text-xs">{{ word.english }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 전투 시작 버튼 -->
        <div class="text-center">
          <button
            @click="startBattle"
            class="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 shadow-2xl"
          >
            ⚔️ 전투 시작
          </button>
        </div>
      </div>
      
      <!-- 하단 힌트 -->
      <div class="text-center text-purple-300 text-sm mt-8">
        <p>💡 한글 단어에 맞는 영어 단어를 선택하여 적을 공격하세요!</p>
      </div>
    </div>
    
    <!-- 파티클 효과 -->
    <div class="absolute inset-0 pointer-events-none">
      <div 
        v-for="n in 15" 
        :key="n"
        class="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-float"
        :style="{ 
          left: Math.random() * 100 + '%', 
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 5 + 's',
          animationDuration: (3 + Math.random() * 2) + 's'
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const isAnimating = ref(true)
const currentParagraph = ref(0)

// 현재 스토리 가져오기
const currentStory = computed(() => gameStore.currentStory)

// 스토리를 문단별로 나누기
const storyParagraphs = computed(() => {
  if (!currentStory.value?.content) return []
  return currentStory.value.content.split('\n').filter(p => p.trim())
})

// 스토리 아이콘
const getStoryIcon = (storyId) => {
  const icons = {
    1: '📚', // 마법 도서관
    2: '🌀', // 시간의 미로
    3: '👹'  // 어둠의 악마
  }
  return icons[storyId] || '⚔️'
}

// 뒤로가기
const goBack = () => {
  gameStore.goToMenu()
}

// 전투 시작
const startBattle = () => {
  gameStore.startBattle()
}

// 텍스트 애니메이션 효과
onMounted(() => {
  // 문단별로 순차적으로 나타나는 효과
  const interval = setInterval(() => {
    currentParagraph.value++
    if (currentParagraph.value >= storyParagraphs.value.length) {
      clearInterval(interval)
      isAnimating.value = false
    }
  }, 800)
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.8);
}
</style> 