<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black relative overflow-hidden">
    <!-- 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    
    <!-- 메인 콘텐츠 -->
    <div class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <!-- 게임 타이틀 -->
      <div class="text-center mb-12 pt-8">
        <h1 class="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
          ⚔️ 워드 배틀 ⚔️
        </h1>
        <p class="text-xl text-purple-200 opacity-90">Word Battle</p>
        <div class="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded"></div>
      </div>
      
      <!-- 지역 선택 섹션 -->
      <div class="flex-1 max-w-5xl mx-auto w-full">
        <h2 class="text-3xl font-bold text-white text-center mb-8">지역 선택</h2>
        
        <!-- 지역 카드들 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div
            v-for="region in gameStore.availableRegions"
            :key="region.id"
            @click="selectRegion(region.id)"
            class="bg-gradient-to-br from-purple-800/80 to-blue-800/80 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-purple-400/60"
            :class="{ 'ring-4 ring-purple-400 bg-gradient-to-br from-purple-700/90 to-blue-700/90': selectedRegionId === region.id }"
          >
            <!-- 지역 아이콘 -->
            <div class="text-center mb-4">
              <div class="text-5xl mb-3">
                {{ getRegionIcon(region.id) }}
              </div>
              <h3 class="text-xl font-bold text-white">{{ region.title }}</h3>
            </div>
            
            <!-- 지역 설명 -->
            <p class="text-purple-200 text-sm text-center mb-4">
              {{ region.description }}
            </p>
            
            <!-- 10단계 진행도 표시 -->
            <div class="bg-black/30 rounded-lg p-4 mb-4">
              <div class="text-xs text-purple-300 mb-2 text-center">총 10단계 모험</div>
              <div class="grid grid-cols-5 gap-1 mb-3">
                <div
                  v-for="stage in 10"
                  :key="stage"
                  class="w-6 h-6 rounded border-2 flex items-center justify-center text-xs"
                  :class="stage <= 9 ? 'border-purple-400 bg-purple-600/30 text-purple-200' : 'border-red-400 bg-red-600/30 text-red-200'"
                >
                  <span v-if="stage === 10">👑</span>
                  <span v-else>{{ stage }}</span>
                </div>
              </div>
              <div class="text-xs text-center">
                <span class="text-purple-300">1-9단계: 일반 몬스터</span><br>
                <span class="text-red-300">10단계: 최종 보스</span>
              </div>
            </div>
            
            <!-- 첫 번째 적 미리보기 -->
            <div class="bg-black/30 rounded-lg p-3 text-center">
              <div class="text-xs text-purple-300 mb-1">첫 번째 적</div>
              <div class="text-white font-semibold">{{ region.stages[0].enemy.name }}</div>
              <div class="text-xs text-red-300">HP: {{ region.stages[0].enemy.hp }}</div>
            </div>
          </div>
        </div>
        
        <!-- 지역 선택 버튼 -->
        <div class="text-center">
          <button
            @click="startAdventure"
            :disabled="!selectedRegionId"
            class="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl"
          >
            <span v-if="!selectedRegionId">지역을 선택하세요</span>
            <span v-else>🚀 모험 시작 </span>
          </button>
        </div>
        
        <!-- 게임 설명 -->
        <div class="mt-8 bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6">
          <h3 class="text-lg font-bold text-blue-200 mb-3 text-center">🎮 게임 진행 방식</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-100">
            <div class="flex items-center justify-center gap-3">
              <span class="text-xl">📖</span>
              <div class="text-left">
                <div class="font-semibold">스토리 → 전투 반복</div>
                <div class="text-xs text-blue-300">각 단계마다 스토리를 읽고 전투 진행</div>
              </div>
            </div>
            <div class="flex items-center justify-center gap-3">
              <span class="text-xl">🎯</span>
              <div class="text-left">
                <div class="font-semibold">총 10단계 클리어</div>
                <div class="text-xs text-blue-300">9단계 일반 몬스터 + 1단계 최종 보스</div>
              </div>
            </div>
            <div class="flex items-center justify-center gap-3">
              <span class="text-xl">💊</span>
              <div class="text-left">
                <div class="font-semibold">단계별 HP 회복</div>
                <div class="text-xs text-blue-300">각 단계 클리어 시 체력을 20씩 회복</div>
              </div>
            </div>
            <div class="flex items-center justify-center gap-3">
              <span class="text-xl">👑</span>
              <div class="text-left">
                <div class="font-semibold">최종 보스전</div>
                <div class="text-xs text-blue-300">10단계에서 강력한 보스와 최후 결전!</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 하단 정보 -->
      <div class="text-center text-purple-300 text-sm mt-8">
        <p>영어 단어로 적을 물리치는 어드벤처</p>
        <p class="mt-2">Vue.js 3 + Nuxt.js 3 + Pinia 🚀</p>
        
        <!-- API 테스트 버튼 (개발용) -->
        <div class="mt-4">
          <button
            @click="testChatGPT"
            :disabled="isTestingAPI"
            class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {{ isTestingAPI ? '🔄 테스트 중...' : '🤖 ChatGPT API 테스트' }}
          </button>
          <p class="text-xs text-gray-400 mt-1">콘솔에서 결과 확인</p>
        </div>
      </div>
    </div>
    
    <!-- 별빛 효과 -->
    <div class="absolute inset-0 pointer-events-none">
      <div 
        v-for="n in 20" 
        :key="n"
        class="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-twinkle"
        :style="{ 
          left: Math.random() * 100 + '%', 
          top: Math.random() * 100 + '%',
          animationDelay: Math.random() * 3 + 's'
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const selectedRegionId = ref<number | null>(null)
const isTestingAPI = ref<boolean>(false)

// 지역 아이콘 반환
const getRegionIcon = (regionId: number): string => {
  const icons: Record<number, string> = {
    1: '📚', // 마법 도서관
    2: '🌀', // 시간의 미로
    3: '🏰'  // 어둠의 성
  }
  return icons[regionId] || '⚔️'
}

// 지역 선택
const selectRegion = (regionId: number): void => {
  selectedRegionId.value = regionId
}

// 모험 시작
const startAdventure = () => {
  if (selectedRegionId.value) {
    gameStore.selectRegion(selectedRegionId.value)
  }
}

// API 응답 타입 정의
interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface APIResponse {
  success: boolean;
  message?: string;
  usage?: TokenUsage;
  error?: string;
}

interface APIRequestBody {
  message: string;
}

// ChatGPT API 테스트 함수
const testChatGPT = async (): Promise<void> => {
  isTestingAPI.value = true
  
  try {
    console.log('🚀 ChatGPT API 테스트 시작...')
    
    // $fetch 타입을 명시적으로 지정
    const response = await $fetch<APIResponse>('/api/chat', {
      method: 'POST',
      body: {
        message: '안녕하세요! 간단한 영어 단어 퀴즈를 하나 만들어주세요.'
      } as APIRequestBody
    })
    
    console.log('✅ ChatGPT API 테스트 성공!')
    console.log('📝 응답 데이터:', response)
    
    if (response.success) {
      console.log('💬 ChatGPT 응답:', response.message)
      console.log('📊 토큰 사용량:', response.usage)
    } else {
      console.error('❌ API 오류:', response.error)
    }
    
  } catch (error: unknown) {
    console.error('🔥 ChatGPT API 호출 실패:', error)
    if (error instanceof Error) {
      console.error('상세 오류:', error.message)
    }
  } finally {
    isTestingAPI.value = false
  }
}
</script>

<style scoped>
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.animate-twinkle {
  animation: twinkle 2s infinite;
}

/* 커스텀 스크롤바 */
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