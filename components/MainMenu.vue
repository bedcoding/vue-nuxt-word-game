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
      
      <!-- 스토리 선택 섹션 -->
      <div class="flex-1 max-w-4xl mx-auto w-full">
        <h2 class="text-3xl font-bold text-white text-center mb-8">스토리 선택</h2>
        
        <!-- 스토리 카드들 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div
            v-for="story in gameStore.availableStories"
            :key="story.id"
            @click="selectStory(story.id)"
            class="bg-gradient-to-br from-purple-800/80 to-blue-800/80 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-purple-400/60"
            :class="{ 'ring-4 ring-purple-400 bg-gradient-to-br from-purple-700/90 to-blue-700/90': selectedStoryId === story.id }"
          >
            <!-- 스토리 아이콘 -->
            <div class="text-center mb-4">
              <div class="text-4xl mb-2">
                {{ getStoryIcon(story.id) }}
              </div>
              <h3 class="text-xl font-bold text-white">{{ story.title }}</h3>
            </div>
            
            <!-- 스토리 설명 -->
            <p class="text-purple-200 text-sm text-center mb-4">
              {{ story.description }}
            </p>
            
            <!-- 적 정보 -->
            <div class="bg-black/30 rounded-lg p-3 text-center">
              <div class="text-xs text-purple-300 mb-1">적</div>
              <div class="text-white font-semibold">{{ story.enemy.name }}</div>
              <div class="text-xs text-red-300">HP: {{ story.enemy.hp }}</div>
            </div>
          </div>
        </div>
        
        <!-- 지역 선택 버튼 -->
        <div class="text-center">
          <button
            @click="startStory"
            :disabled="!selectedStoryId"
            class="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-12 rounded-xl text-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl"
          >
            <span v-if="!selectedStoryId">스토리를 선택하세요</span>
            <span v-else>🌟 지역 선택 (게임 시작)</span>
          </button>
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

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const selectedStoryId = ref(null)
const isTestingAPI = ref(false)

// 스토리 아이콘 반환
const getStoryIcon = (storyId) => {
  const icons = {
    1: '📚', // 마법 도서관
    2: '🌀', // 시간의 미로
    3: '👹'  // 어둠의 악마
  }
  return icons[storyId] || '⚔️'
}

// 스토리 선택
const selectStory = (storyId) => {
  selectedStoryId.value = storyId
  gameStore.selectStory(storyId)
}

// 스토리 시작
const startStory = () => {
  if (selectedStoryId.value) {
    gameStore.setGamePhase('story')
  }
}

// ChatGPT API 테스트 함수
const testChatGPT = async () => {
  isTestingAPI.value = true
  
  try {
    console.log('🚀 ChatGPT API 테스트 시작...')
    
    const response = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        message: '안녕하세요! 간단한 영어 단어 퀴즈를 하나 만들어주세요.'
      }
    })
    
    console.log('✅ ChatGPT API 테스트 성공!')
    console.log('📝 응답 데이터:', response)
    
    if (response.success) {
      console.log('💬 ChatGPT 응답:', response.message)
      console.log('📊 토큰 사용량:', response.usage)
    } else {
      console.error('❌ API 오류:', response.error)
    }
    
  } catch (error) {
    console.error('🔥 ChatGPT API 호출 실패:', error)
    console.error('상세 오류:', error.message)
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