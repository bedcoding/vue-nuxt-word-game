<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 via-pink-500 to-red-500 p-4">
    <div class="container mx-auto max-w-6xl">
      <!-- 상단 네비게이션 -->
      <div class="flex justify-between items-center mb-6">
        <button
          @click="goBack"
          class="bg-gray-800/80 hover:bg-gray-700/80 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
        >
          ← 뒤로가기
        </button>
        
        <div class="text-center">
          <h1 class="text-3xl font-bold text-white drop-shadow-lg">
            ⚔️ {{ currentStory?.title }} ⚔️
          </h1>
          <p class="text-white opacity-80">{{ currentStory?.enemy.name }}과의 전투</p>
        </div>
        
        <div class="w-24"></div> <!-- 균형을 위한 공간 -->
      </div>
      
      <!-- 전투 화면 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- 플레이어 캐릭터 (왼쪽) -->
        <div class="flex justify-center items-center">
          <div class="relative">
            <Character 
              :character="gameStore.player"
              :is-player="true"
              :is-attacking="isPlayerAttacking"
            />
          </div>
        </div>
        
        <!-- 문제 패널 (중앙) -->
        <div class="lg:col-span-1">
          <QuestionPanel
            :current-question="gameStore.currentQuestion"
            :choices="gameStore.currentChoices"
            :is-player-turn="gameStore.isPlayerTurn"
            :is-game-over="gameStore.isGameOver"
            :score="gameStore.score"
            :level="gameStore.level"
            :is-player-win="gameStore.isPlayerWin"
            @select-answer="handleAnswer"
          />
        </div>
        
        <!-- 적 캐릭터 (오른쪽) -->
        <div class="flex justify-center items-center">
          <div class="relative">
            <Character 
              :character="gameStore.enemy"
              :is-player="false"
              :is-attacking="isEnemyAttacking"
            />
          </div>
        </div>
      </div>
      
      <!-- 전투 로그 -->
      <div class="bg-black bg-opacity-50 rounded-lg p-4 max-h-40 overflow-y-auto">
        <h3 class="text-white font-bold mb-2">⚡ 전투 로그</h3>
        <div class="space-y-1">
          <div 
            v-for="(log, index) in battleLogs" 
            :key="index"
            class="text-sm text-white opacity-90"
          >
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'

// 스토어 사용
const gameStore = useGameStore()

// 반응형 상태
const isPlayerAttacking = ref(false)
const isEnemyAttacking = ref(false)
const battleLogs = ref([])

// 현재 스토리
const currentStory = computed(() => gameStore.currentStory)

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  // 초기화
  addBattleLog('🎯 전투가 시작되었습니다!')
  addBattleLog('📚 한글 단어에 맞는 영어 단어를 선택하세요!')
  addBattleLog(`🛡️ ${gameStore.player.name} VS ${gameStore.enemy.name} 👾`)
})

// 답안 선택 처리
const handleAnswer = (selectedAnswer) => {
  const isCorrect = selectedAnswer === gameStore.currentQuestion.english
  
  if (isCorrect) {
    // 정답 처리
    isPlayerAttacking.value = true
    addBattleLog(`✅ 정답! "${selectedAnswer}"`)
    addBattleLog(`⚔️ ${gameStore.player.name}이(가) ${gameStore.enemy.name}을(를) 공격했습니다!`)
    
    setTimeout(() => {
      isPlayerAttacking.value = false
    }, 500)
  } else {
    // 오답 처리
    isEnemyAttacking.value = true
    addBattleLog(`❌ 틀렸습니다! 정답은 "${gameStore.currentQuestion.english}"`)
    addBattleLog(`💥 ${gameStore.enemy.name}이(가) ${gameStore.player.name}을(를) 공격했습니다!`)
    
    setTimeout(() => {
      isEnemyAttacking.value = false
    }, 500)
  }
  
  // 게임 스토어의 답안 선택 처리
  gameStore.selectAnswer(selectedAnswer)
  
  // 게임 종료 체크
  setTimeout(() => {
    if (gameStore.isGameOver) {
      if (gameStore.isPlayerWin) {
        addBattleLog('🎉 승리! 모든 적을 물리쳤습니다!')
      } else {
        addBattleLog('💀 패배... 다시 도전해보세요!')
      }
    }
  }, 1000)
}

// 뒤로가기
const goBack = () => {
  gameStore.setGamePhase('story')
}

// 전투 로그 추가
const addBattleLog = (message) => {
  battleLogs.value.push(message)
  
  // 로그가 너무 많아지면 오래된 것 제거
  if (battleLogs.value.length > 10) {
    battleLogs.value.shift()
  }
}
</script>

<style scoped>
/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style> 