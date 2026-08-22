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
import { onMounted, onScopeDispose, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useGameFlow } from '@/composables/useGameFlow'

const ATTACK_ANIMATION_MS = 500

const gameStore = useGameStore()
const flow = useGameFlow()

const isPlayerAttacking = ref(false)
const isEnemyAttacking = ref(false)

const emit = defineEmits<{
  battleLog: [message: string]
}>()

// 공격 애니메이션 타이머도 화면이 사라질 때 정리한다
let attackTimer: ReturnType<typeof setTimeout> | null = null
onScopeDispose(() => {
  if (attackTimer) clearTimeout(attackTimer)
})

const playAttackAnimation = (target: 'player' | 'enemy'): void => {
  if (attackTimer) clearTimeout(attackTimer)

  isPlayerAttacking.value = target === 'player'
  isEnemyAttacking.value = target === 'enemy'

  attackTimer = setTimeout(() => {
    isPlayerAttacking.value = false
    isEnemyAttacking.value = false
    attackTimer = null
  }, ATTACK_ANIMATION_MS)
}

onMounted(() => {
  emit('battleLog', '🎯 전투가 시작되었습니다!')
  emit('battleLog', '📚 한글 단어에 맞는 영어 단어를 선택하세요!')
  emit('battleLog', `🛡️ ${gameStore.player.name} VS ${gameStore.enemy.name} 👾`)
})

/**
 * 답 제출. 결과를 동기적으로 받아서 로그를 찍는다.
 * 이전에는 setTimeout으로 스토어 상태를 다시 들여다보며 승패를 추측했는데,
 * 이제는 결과 값이 그대로 넘어오므로 타이밍에 의존하지 않는다.
 */
const handleAnswer = (choice: string): void => {
  const enemyName = gameStore.enemy.name
  const playerName = gameStore.player.name

  const outcome = flow.answer(choice)
  if (!outcome.accepted) return

  if (outcome.correct) {
    playAttackAnimation('player')
    emit('battleLog', `✅ 정답! "${choice}"`)
    emit('battleLog', `⚔️ ${playerName} → ${enemyName} 공격!`)
  } else {
    playAttackAnimation('enemy')
    emit('battleLog', `❌ 틀렸습니다! 정답은 "${outcome.correctAnswer}"`)
    emit('battleLog', `💥 ${enemyName} → ${playerName} 공격!`)
  }

  switch (outcome.result) {
    case 'stageCleared':
      emit('battleLog', '🎉 승리! 다음 단계로 진행합니다!')
      break
    case 'regionCleared':
      emit('battleLog', '👑 모든 단계를 완료했습니다!')
      break
    case 'defeated':
      emit('battleLog', '💀 패배 💀')
      break
  }
}
</script>
