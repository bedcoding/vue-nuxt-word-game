<template>
  <div class="text-center max-w-2xl mx-auto">
    <!-- 패배 아이콘 -->
    <div class="mb-8">
      <div class="text-8xl mb-4">💀</div>
      <h1 class="text-5xl font-bold text-red-400 mb-2 drop-shadow-lg">
        패배...
      </h1>
      <p class="text-xl text-red-200">
        아쉽게도 이번엔 실패했습니다
      </p>
    </div>

    <!-- 패배 메시지 -->
    <div class="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-8">
      <p class="text-lg text-red-100 leading-relaxed">
        😔 이번 전투에서는 아쉽게도 패배했습니다. 하지만 포기하지 마세요! 
        영어 실력을 더 키우고 다시 도전한다면 분명 승리할 수 있을 것입니다. 
        용기를 잃지 말고 다시 한 번 도전해보세요!
      </p>
    </div>

    <!-- 현재 점수 및 진행도 -->
    <div class="bg-gradient-to-r from-red-600/20 to-gray-600/20 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-bold text-red-300 mb-4">⚔️ 전투 결과 ⚔️</h2>
      
      <div class="flex justify-between items-center mb-4 text-red-100">
        <span class="text-lg">획득한 점수</span>
        <span class="text-2xl font-bold text-red-400">{{ gameStore.score }}점</span>
      </div>
      
      <div class="flex justify-between items-center text-red-100">
        <span class="text-lg">도달한 단계</span>
        <span class="text-xl font-bold text-orange-400">{{ gameStore.currentStageNumber }}/10</span>
      </div>
    </div>

    <!-- 격려 메시지 -->
    <div class="bg-blue-900/20 backdrop-blur-sm rounded-lg p-4 mb-8">
      <p class="text-blue-200 text-sm">
        💡 <strong>팁:</strong> 영어 단어를 더 많이 익히고 다시 도전해보세요!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
</script> 