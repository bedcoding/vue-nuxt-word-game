<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
    <!-- 플레이어 캐릭터 (왼쪽) -->
    <div class="flex justify-center items-center">
      <div class="relative">
        <SharedCharacter 
          :character="gameStore.player"
          :is-player="true"
          :is-attacking="isPlayerAttacking"
        />
      </div>
    </div>
    
    <!-- 문제 패널 (중앙) -->
    <div class="lg:col-span-1">
      <SharedQuestionPanel
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
        <SharedCharacter 
          :character="gameStore.enemy"
          :is-player="false"
          :is-attacking="isEnemyAttacking"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

// 반응형 상태
const isPlayerAttacking = ref(false)
const isEnemyAttacking = ref(false)

const emit = defineEmits<{
  battleLog: [message: string]
}>()

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  emit('battleLog', '🎯 전투가 시작되었습니다!')
  emit('battleLog', '📚 한글 단어에 맞는 영어 단어를 선택하세요!')
  emit('battleLog', `🛡️ ${gameStore.player.name} VS ${gameStore.enemy.name} 👾`)
})

// 답안 선택 처리
const handleAnswer = (selectedAnswer: string) => {
  const isCorrect = selectedAnswer === gameStore.currentQuestion?.english
  
  if (isCorrect) {
    // 정답 처리
    isPlayerAttacking.value = true
    emit('battleLog', `✅ 정답! "${selectedAnswer}"`)
    emit('battleLog', `⚔️ ${gameStore.player.name}이(가) ${gameStore.enemy.name}을(를) 공격했습니다!`)
    
    setTimeout(() => {
      isPlayerAttacking.value = false
    }, 500)
  } else {
    // 오답 처리
    isEnemyAttacking.value = true
    emit('battleLog', `❌ 틀렸습니다! 정답은 "${gameStore.currentQuestion?.english}"`)
    emit('battleLog', `💥 ${gameStore.enemy.name}이(가) ${gameStore.player.name}을(를) 공격했습니다!`)
    
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
        emit('battleLog', '🎉 승리! 모든 적을 물리쳤습니다!')
        // 승리 시 결과 페이지로 이동
        setTimeout(() => {
          navigateTo('/result')
        }, 2000)
      } else {
        emit('battleLog', '💀 패배... 다시 도전해보세요!')
        // 패배 시 결과 페이지로 이동
        setTimeout(() => {
          navigateTo('/result')
        }, 2000)
      }
    }
  }, 1000)
}
</script> 