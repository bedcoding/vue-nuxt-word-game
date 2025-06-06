<template>
  <div class="text-center max-w-2xl mx-auto">
    <!-- 승리 아이콘 -->
    <div class="mb-8">
      <div class="text-8xl mb-4">🏆</div>
      <h1 class="text-5xl font-bold text-yellow-400 mb-2 drop-shadow-lg">
        승리!
      </h1>
      <p class="text-xl text-yellow-200">
        모든 적을 물리치고 승리했습니다!
      </p>
    </div>

    <!-- 승리 메시지 -->
    <div class="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-8">
      <p class="text-lg text-yellow-100 leading-relaxed">
        🎉 축하합니다! 용감한 영웅이여, 마침내 모든 적을 물리치고 평화를 되찾았습니다! 
        당신의 영어 실력과 전투 기술이 세상을 구했습니다. 
        새로운 모험이 기다리고 있습니다!
      </p>
    </div>

    <!-- 최종 점수 -->
    <div class="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-lg p-6 mb-8">
      <h2 class="text-2xl font-bold text-yellow-300 mb-4">⚔️ 최종 결과 ⚔️</h2>
      
      <div class="flex justify-between items-center mb-4 text-yellow-100">
        <span class="text-lg">최종 점수</span>
        <span class="text-2xl font-bold text-yellow-400">{{ gameStore.score }}점</span>
      </div>
      
      <div class="flex justify-between items-center text-yellow-100">
        <span class="text-lg">클리어한 단계</span>
        <span class="text-xl font-bold text-green-400">{{ gameStore.currentStageNumber }}/10</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
</script> 