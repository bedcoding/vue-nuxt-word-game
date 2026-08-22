<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black relative overflow-hidden">
    <!-- 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true"></div>

    <!-- 메인 콘텐츠 -->
    <div class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <header>
        <!-- 뒤로가기 + 진행상황 -->
        <div class="mb-6 flex items-center justify-between">
          <SharedBackButton to="/story" />

          <SharedProgressBar
            :title="currentRegion?.title || ''"
            :current-stage="gameStore.currentStageNumber"
            :total-stages="GAME_CONFIG.totalStages"
            :percentage="gameStore.progressPercentage"
          />
        </div>

        <!-- 전투 제목 -->
        <div class="text-center mb-8">
          <div class="text-4xl mb-4" aria-hidden="true">⚔️</div>
          <h1 class="text-4xl font-bold text-white mb-2">
            {{ currentStage?.storyTitle }}
          </h1>
          <div class="text-lg text-purple-300 mb-4">{{ currentStage?.enemy.name }}</div>
          <div class="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded" aria-hidden="true"></div>
        </div>
      </header>

      <main class="flex-1 max-w-6xl mx-auto w-full">
        <BattleField @battle-log="addBattleLog" />

        <!-- 전투 로그 -->
        <BattleLog ref="battleLogRef" />
      </main>
    </div>

    <!-- 파티클 효과 -->
    <SharedParticleEffect />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { GAME_CONFIG } from '@/constants/game.config'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const battleLogRef = ref<{ addBattleLog: (message: string) => void } | null>(null)

const currentRegion = computed(() => gameStore.currentRegion)
const currentStage = computed(() => gameStore.currentStage)

// URL로 직접 들어와도 전투가 성립하도록 보정한다 (문제 생성까지 포함).
// 문제와 셔플된 선택지가 모두 상태에 담기므로 SSR 페이로드로 그대로 전달되고,
// 클라이언트는 같은 값을 그리게 되어 하이드레이션 불일치가 없다.
gameStore.ensureBattleReady()

// 전투 로그 추가 함수
const addBattleLog = (message: string) => {
  battleLogRef.value?.addBattleLog(message)
}

// SEO 설정
useHead({
  title: '전투 - 워드 배틀',
  meta: [
    { name: 'description', content: '영어 단어를 맞춰서 적을 물리치세요!' }
  ]
})
</script>
