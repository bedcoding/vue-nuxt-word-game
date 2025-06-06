<template>
  <div>
    <h2 class="text-3xl font-bold text-white text-center mb-8">지역 선택</h2>
    
    <!-- 지역 카드들 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <MainRegionCard
        v-for="region in gameStore.availableRegions"
        :key="region.id"
        :region="region"
        :is-selected="selectedRegionId === region.id"
        @select="selectRegion"
      />
    </div>
    
    <!-- 지역 선택 버튼 -->
    <div class="text-center">
      <MainStartButton
        :selected-region-id="selectedRegionId"
        @start="startAdventure"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const selectedRegionId = ref<number | null>(null)

// 지역 선택
const selectRegion = (regionId: number): void => {
  selectedRegionId.value = regionId
}

// 모험 시작
const startAdventure = () => {
  if (selectedRegionId.value) {
    gameStore.selectRegion(selectedRegionId.value)
    navigateTo('/story')
  }
}
</script> 