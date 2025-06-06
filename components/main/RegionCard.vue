<template>
  <div
    @click="$emit('select', region.id)"
    class="bg-gradient-to-br from-purple-800/80 to-blue-800/80 backdrop-blur-sm border border-purple-400/30 rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:border-purple-400/60"
    :class="{ 'ring-4 ring-purple-400 bg-gradient-to-br from-purple-700/90 to-blue-700/90': isSelected }"
  >
    <!-- 지역 아이콘 -->
    <div class="text-center mb-4">
      <div class="text-5xl mb-3">
        {{ getRegionIcon(region.id) }}
      </div>
      <h3 class="text-xl font-bold text-white">{{ region.title }}</h3>
    </div>
    
    <!-- 지역 설명 -->
    <p class="text-purple-200 text-sm text-center mb-4">
      {{ region.description }}
    </p>
    
    <!-- 10단계 진행도 표시 -->
    <MainStageProgress />
    
    <!-- 첫 번째 적 미리보기 -->
    <MainEnemyPreview :enemy="region.stages[0].enemy" />
  </div>
</template>

<script setup lang="ts">
import type { GameRegion } from '@/types/game'

interface Props {
  region: GameRegion
  isSelected: boolean
}

defineProps<Props>()
defineEmits<{
  select: [regionId: number]
}>()

// 지역 아이콘 반환
const getRegionIcon = (regionId: number): string => {
  const icons: Record<number, string> = {
    1: '📚', // 마법 도서관
    2: '🌀', // 시간의 미로
    3: '🏰'  // 어둠의 성
  }
  return icons[regionId] || '⚔️'
}
</script> 