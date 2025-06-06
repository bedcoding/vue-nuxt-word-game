<template>
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
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
</script> 