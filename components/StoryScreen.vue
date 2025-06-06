<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black relative overflow-hidden">
    <!-- 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    
    <!-- 메인 콘텐츠 -->
    <div class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <!-- 뒤로가기 버튼 및 진행 상황 -->
      <div class="mb-6 flex items-center justify-between">
        <button
          @click="goBack"
          class="bg-gray-800/80 hover:bg-gray-700/80 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          ← 뒤로가기
        </button>
        
        <!-- 진행 상황 표시 -->
        <div class="bg-black/40 backdrop-blur-sm border border-purple-400/30 rounded-lg px-4 py-2">
          <div class="text-white text-sm font-bold">
            {{ currentRegion?.title }} - {{ gameStore.currentStageNumber }}/10 단계
          </div>
          <div class="flex items-center gap-1 mt-1">
            <div class="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                :style="{ width: gameStore.progressPercentage + '%' }"
              ></div>
            </div>
            <span class="text-xs text-purple-300 ml-2">{{ Math.round(gameStore.progressPercentage) }}%</span>
          </div>
        </div>
      </div>
      
      <!-- 스토리 제목 -->
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
      
      <!-- 스토리 콘텐츠 -->
      <div class="flex-1 max-w-4xl mx-auto w-full">
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
          <div v-if="currentStage" class="mt-8 p-6 bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-400/30 rounded-lg">
            <h3 class="text-xl font-bold text-red-200 mb-4 text-center">
              {{ gameStore.isBossStage ? '👑 최종 보스 정보 👑' : '⚠️ 적 정보 ⚠️' }}
            </h3>
            <div class="flex items-center justify-between gap-8">
              <!-- 적 정보 -->
              <div class="text-center flex-1">
                <div class="text-6xl mb-3 filter drop-shadow-lg">
                  {{ gameStore.isBossStage ? '👹' : '👾' }}
                </div>
                <div class="text-white font-bold text-lg">{{ currentStage?.enemy.name }}</div>
                <div class="text-red-300 text-sm font-medium">HP: {{ currentStage?.enemy.hp }}</div>
              </div>
              
              <!-- VS 구분선 -->
              <div class="text-center flex-shrink-0">
                <div class="text-2xl font-bold text-yellow-300 mb-2 animate-pulse">VS</div>
                <div class="w-0.5 h-16 bg-gradient-to-b from-yellow-400 to-red-400 mx-auto"></div>
              </div>
              
              <!-- 플레이어 정보 -->
              <div class="text-center flex-1">
                <div class="text-6xl mb-3 filter drop-shadow-lg">🛡️</div>
                <div class="text-white font-bold text-lg">{{ gameStore.player.name }}</div>
                <div class="text-green-300 text-sm font-medium">HP: {{ gameStore.player.hp }}</div>
              </div>
            </div>
          </div>
          
          <!-- 단어 미리보기 -->
          <div v-if="currentStage" class="mt-6 p-4 bg-blue-900/30 border border-blue-400/30 rounded-lg">
            <h4 class="text-lg font-semibold text-blue-200 mb-3 text-center">📚 출제될 단어들</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div 
                v-for="word in currentStage?.words"
                :key="word.korean"
                class="text-center p-2 bg-blue-800/30 rounded"
              >
                <div class="text-white font-medium">{{ word.korean }}</div>
                <div class="text-blue-300 text-xs">{{ word.english }}</div>
              </div>
            </div>
          </div>
          
          <!-- 단계별 보상 정보 -->
          <div class="mt-6 p-4 bg-green-900/30 border border-green-400/30 rounded-lg">
            <h4 class="text-lg font-semibold text-green-200 mb-3 text-center">🎁 클리어 보상</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div class="text-center p-2 bg-green-800/30 rounded">
                <div class="text-green-300 font-medium">승리 점수</div>
                <div class="text-white text-lg font-bold">+50점</div>
              </div>
              <div class="text-center p-2 bg-green-800/30 rounded">
                <div class="text-green-300 font-medium">체력 회복</div>
                <div class="text-white text-lg font-bold">
                  {{ gameStore.isBossStage ? '없음' : '+20 HP' }}
                </div>
              </div>
              <div class="text-center p-2 bg-green-800/30 rounded">
                <div class="text-green-300 font-medium">보스 보너스</div>
                <div class="text-white text-lg font-bold">
                  {{ gameStore.isBossStage ? '+100점' : '없음' }}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 전투 시작 버튼 -->
        <div class="text-center">
          <button
            @click="startBattle"
            :disabled="!currentStoryData?.content"
            class="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl"
          >
            {{ 
              !currentStoryData?.content ? '스토리 생성 대기 중...' :
              gameStore.isBossStage ? '👑 최종 결전 시작!' : '⚔️ 전투 시작' 
            }}
          </button>
        </div>
      </div>
      
      <!-- 하단 힌트 -->
      <div class="text-center text-purple-300 text-sm mt-8">
        <p>💡 한글 단어에 맞는 영어 단어를 선택하여 적을 공격하세요!</p>
        <p class="mt-1">🏆 10단계를 모두 클리어하면 승리합니다!</p>
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

// 현재 지역과 단계 정보
const currentRegion = computed(() => gameStore.currentRegion)
const currentStage = computed(() => gameStore.currentStage)

// AI 생성 스토리 또는 하드코딩된 스토리 사용
const currentStoryData = computed(() => gameStore.currentStoryData)

// 스토리를 문단별로 나누기
const storyParagraphs = computed(() => {
  if (!currentStoryData.value?.content) return []
  return currentStoryData.value.content.split('\n').filter(p => p.trim())
})

// 스토리 아이콘
const getStoryIcon = (regionId) => {
  const icons = {
    1: '📚', // 마법 도서관
    2: '🌀', // 시간의 미로
    3: '🏰'  // 어둠의 성
  }
  return icons[regionId] || '⚔️'
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
    transform: translateY(1.25rem);
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
    transform: translateY(-1.25rem) rotate(120deg);
  }
  66% {
    transform: translateY(0.625rem) rotate(240deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

/* 이모지 렌더링 최적화 */
.text-6xl {
  font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", emoji, sans-serif;
  line-height: 1;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 그림자 효과 최적화 */
.filter {
  filter: drop-shadow(0 0.25rem 0.5rem rgba(0, 0, 0, 0.3));
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .flex-1 .text-6xl {
    font-size: 3rem;
  }
  
  .gap-8 {
    gap: 1rem;
  }
}

/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 0.5rem;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.25rem;
}

::-webkit-scrollbar-thumb {
  background: rgba(147, 51, 234, 0.6);
  border-radius: 0.25rem;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(147, 51, 234, 0.8);
}
</style> 