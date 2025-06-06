<template>
  <div class="mt-8 p-6 bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-400/30 rounded-lg">
    <h3 class="text-xl font-bold text-red-200 mb-4 text-center">
      {{ gameStore.isBossStage ? '👑 최종 보스 정보 👑' : '⚠️ 적 정보 ⚠️' }}
    </h3>
    <div class="flex items-center justify-between gap-8">
      <!-- 적 정보 -->
      <div class="text-center flex-1">
        <div class="text-6xl mb-3 filter drop-shadow-lg">
          {{ gameStore.isBossStage ? '👹' : '👾' }}
        </div>
        <div class="text-white font-bold text-lg">{{ stage.enemy.name }}</div>
        <div class="text-red-300 text-sm font-medium">HP: {{ stage.enemy.hp }}</div>
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
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import type { GameStage } from '@/types/game'

interface Props {
  stage: GameStage
}

defineProps<Props>()

const gameStore = useGameStore()
</script> 