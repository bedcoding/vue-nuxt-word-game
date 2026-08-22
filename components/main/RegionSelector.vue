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

    <!-- 모험 시작 버튼 -->
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
import { useGameFlow } from '@/composables/useGameFlow'

const gameStore = useGameStore()
const flow = useGameFlow()

const selectedRegionId = ref<number | null>(null)

const selectRegion = (regionId: number): void => {
  selectedRegionId.value = regionId
}

// 상태 전이는 스토어, 화면 이동은 useGameFlow가 담당한다
const startAdventure = (): void => {
  if (selectedRegionId.value === null) return
  void flow.startRegion(selectedRegionId.value)
}
</script>
