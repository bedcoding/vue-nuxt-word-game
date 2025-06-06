<template>
  <div class="mb-6 flex items-center justify-between">
    <SharedBackButton to="/" />
    
    <!-- 진행 상황 표시 -->
    <SharedProgressBar
      :title="currentRegion?.title || ''"
      :current-stage="gameStore.currentStageNumber"
      :total-stages="10"
      :percentage="gameStore.progressPercentage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const currentRegion = computed(() => gameStore.currentRegion)
</script> 