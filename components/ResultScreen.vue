<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden flex items-center justify-center">
    <!-- 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    
    <!-- 결과 모달 -->
    <div class="relative z-10 bg-black/60 backdrop-blur-lg border border-purple-400/50 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
      <!-- 결과 아이콘 -->
      <div class="text-8xl mb-6 animate-bounce">
        {{ isPlayerWin ? '🎉' : '💀' }}
      </div>
      
      <!-- 결과 제목 -->
      <h2 class="text-4xl font-bold mb-4" :class="isPlayerWin ? 'text-green-400' : 'text-red-400'">
        {{ isPlayerWin ? '승리!' : '패배!' }}
      </h2>
      
      <!-- 결과 메시지 -->
      <p class="text-lg text-purple-200 mb-6">
        <span v-if="isPlayerWin">
          {{ currentStory?.enemy.name }}을(를) 물리쳤습니다!<br>
          영어 실력으로 승리를 쟁취했네요!
        </span>
        <span v-else>
          {{ currentStory?.enemy.name }}에게 패배했습니다...<br>
          더 열심히 공부하고 다시 도전하세요!
        </span>
      </p>
      
      <!-- 점수 표시 -->
      <div class="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-400/30 rounded-lg p-4 mb-6">
        <div class="text-sm text-blue-300 mb-1">최종 점수</div>
        <div class="text-3xl font-bold text-white">{{ gameStore.score }}점</div>
      </div>
      
      <!-- 스토리 정보 -->
      <div class="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4 mb-8">
        <div class="flex items-center justify-center gap-3 mb-2">
          <span class="text-2xl">{{ getStoryIcon(currentStory?.id) }}</span>
          <span class="text-white font-semibold">{{ currentStory?.title }}</span>
        </div>
        <div class="text-sm text-gray-400">
          {{ isPlayerWin ? '완료' : '도전 실패' }}
        </div>
      </div>
      
      <!-- 버튼들 -->
      <div class="space-y-3">
        <!-- 다시 도전 -->
        <button
          @click="retryBattle"
          class="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          🔄 다시 도전
        </button>
        
        <!-- 다른 스토리 선택 -->
        <button
          @click="selectNewStory"
          class="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          📚 다른 스토리 선택
        </button>
        
        <!-- 메인 메뉴 -->
        <button
          @click="goToMenu"
          class="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          🏠 메인 메뉴
        </button>
      </div>
    </div>
    
    <!-- 승리 시 색종이 효과 -->
    <div v-if="isPlayerWin" class="absolute inset-0 pointer-events-none">
      <div 
        v-for="n in 30" 
        :key="n"
        class="absolute w-2 h-6 animate-confetti"
        :class="getConfettiColor(n)"
        :style="{ 
          left: Math.random() * 100 + '%', 
          animationDelay: Math.random() * 3 + 's',
          animationDuration: (2 + Math.random() * 3) + 's'
        }"
      ></div>
    </div>
    
    <!-- 패배 시 어둠 효과 -->
    <div v-else class="absolute inset-0 pointer-events-none">
      <div 
        v-for="n in 10" 
        :key="n"
        class="absolute w-4 h-4 bg-red-500/20 rounded-full animate-pulse"
        :style="{ 
          left: Math.random() * 100 + '%', 
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 2 + 's'
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

// 승리 여부
const isPlayerWin = computed(() => gameStore.isPlayerWin)

// 현재 스토리
const currentStory = computed(() => gameStore.currentStory)

// 스토리 아이콘
const getStoryIcon = (storyId) => {
  const icons = {
    1: '📚', // 마법 도서관
    2: '🌀', // 시간의 미로
    3: '👹'  // 어둠의 악마
  }
  return icons[storyId] || '⚔️'
}

// 색종이 색상
const getConfettiColor = (n) => {
  const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400', 
    'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'
  ]
  return colors[n % colors.length]
}

// 다시 도전
const retryBattle = () => {
  gameStore.startBattle()
}

// 다른 스토리 선택
const selectNewStory = () => {
  gameStore.goToMenu()
}

// 메인 메뉴로
const goToMenu = () => {
  gameStore.goToMenu()
}
</script>

<style scoped>
@keyframes confetti {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.animate-confetti {
  animation: confetti 3s linear infinite;
}
</style> 