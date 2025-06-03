<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden flex items-center justify-center">
    <!-- 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    
    <!-- 결과 모달 -->
    <div class="relative z-10 bg-black/60 backdrop-blur-lg border border-purple-400/50 rounded-2xl p-8 max-w-lg w-full mx-4 text-center">
      <!-- 결과 아이콘 -->
      <div class="text-8xl mb-6 animate-bounce">
        {{ getResultIcon() }}
      </div>
      
      <!-- 결과 제목 -->
      <h2 class="text-4xl font-bold mb-4" :class="getResultColor()">
        {{ getResultTitle() }}
      </h2>
      
      <!-- 결과 메시지 -->
      <p class="text-lg text-purple-200 mb-6">
        {{ getResultMessage() }}
      </p>
      
      <!-- 진행 상황 표시 -->
      <div class="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-600/30 rounded-lg p-4 mb-6">
        <div class="text-sm text-gray-300 mb-2">
          {{ currentRegion?.title }} - {{ gameStore.currentStageNumber }}/10 단계
        </div>
        <div class="flex items-center justify-center gap-2 mb-2">
          <div class="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              :style="{ width: gameStore.progressPercentage + '%' }"
            ></div>
          </div>
          <span class="text-xs text-purple-300">{{ Math.round(gameStore.progressPercentage) }}%</span>
        </div>
        <div class="text-xs text-gray-400">
          {{ isRegionComplete ? '지역 완료!' : `${10 - gameStore.currentStageNumber}단계 남음` }}
        </div>
      </div>
      
      <!-- 점수 표시 -->
      <div class="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-400/30 rounded-lg p-4 mb-6">
        <div class="text-sm text-blue-300 mb-1">최종 점수</div>
        <div class="text-3xl font-bold text-white">{{ gameStore.score }}점</div>
        
        <!-- 보스 클리어 보너스 표시 -->
        <div v-if="isRegionComplete && isPlayerWin" class="mt-2">
          <div class="text-xs text-yellow-300">👑 지역 완주 보너스: +100점!</div>
        </div>
      </div>
      
      <!-- 적 정보 -->
      <div class="bg-gray-800/50 border border-gray-600/30 rounded-lg p-4 mb-6">
        <div class="flex items-center justify-center gap-3 mb-2">
          <span class="text-2xl">{{ currentStage?.stage === 10 ? '👹' : '👾' }}</span>
          <span class="text-white font-semibold">{{ currentStage?.enemy.name }}</span>
        </div>
        <div class="text-sm text-gray-400">
          {{ currentStage?.storyTitle }} - {{ isPlayerWin ? '클리어!' : '도전 실패' }}
        </div>
      </div>
      
      <!-- 버튼들 -->
      <div class="space-y-3">
        <!-- 승리한 경우 -->
        <template v-if="isPlayerWin">
          <!-- 지역 완주한 경우 -->
          <template v-if="isRegionComplete">
            <button
              @click="selectNewRegion"
              class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              🌟 새로운 지역 도전
            </button>
          </template>
          <!-- 지역 진행 중인 경우 -->
          <template v-else>
            <button
              @click="continueAdventure"
              class="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              ➡️ 다음 단계로 ({{ gameStore.currentStageNumber + 1 }}/10)
            </button>
          </template>
        </template>
        
        <!-- 패배한 경우 -->
        <template v-else>
          <button
            @click="retryStage"
            class="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            🔄 현재 단계 재도전
          </button>
        </template>
        
        <!-- 공통 버튼들 -->
        <button
          @click="selectNewRegion"
          class="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          🗺️ 다른 지역 선택
        </button>
        
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
        v-for="n in (isRegionComplete ? 50 : 30)" 
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

// 현재 지역과 단계
const currentRegion = computed(() => gameStore.currentRegion)
const currentStage = computed(() => gameStore.currentStage)

// 지역 완주 여부
const isRegionComplete = computed(() => gameStore.currentStageNumber === 10 && isPlayerWin.value)

// 결과 아이콘
const getResultIcon = () => {
  if (!isPlayerWin.value) return '💀'
  if (isRegionComplete.value) return '🏆'
  return '🎉'
}

// 결과 제목
const getResultTitle = () => {
  if (!isPlayerWin.value) return '패배!'
  if (isRegionComplete.value) return '지역 완주!'
  return '단계 클리어!'
}

// 결과 색상
const getResultColor = () => {
  if (!isPlayerWin.value) return 'text-red-400'
  if (isRegionComplete.value) return 'text-yellow-400'
  return 'text-green-400'
}

// 결과 메시지
const getResultMessage = () => {
  if (!isPlayerWin.value) {
    return `${currentStage.value?.enemy.name}에게 패배했습니다...\n더 열심히 공부하고 다시 도전하세요!`
  }
  
  if (isRegionComplete.value) {
    return `축하합니다! ${currentRegion.value?.title}의 모든 단계를 클리어했습니다!\n최종 보스까지 물리친 진정한 영어 마스터입니다!`
  }
  
  return `${currentStage.value?.enemy.name} 처치!\n다음 단계로 계속 모험을 떠나보세요!`
}

// 색종이 색상
const getConfettiColor = (n) => {
  const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400', 
    'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'
  ]
  return colors[n % colors.length]
}

// 다음 단계 계속
const continueAdventure = () => {
  // 이미 nextStage에서 자동으로 다음 단계로 진행됨
  gameStore.goToStory()
}

// 현재 단계 재도전
const retryStage = () => {
  // 현재 단계 다시 로드하고 스토리부터 시작
  gameStore.loadCurrentStage()
  gameStore.goToStory()
}

// 새로운 지역 선택
const selectNewRegion = () => {
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