<template>
  <div class="bg-black/30 rounded-lg p-4 mb-4">
    <div class="text-xs text-purple-300 mb-2 text-center">총 10단계 모험</div>
    <div class="grid grid-cols-5 gap-1 mb-3">
      <div
        v-for="stage in 10"
        :key="stage"
        class="w-6 h-6 rounded border-2 flex items-center justify-center text-xs"
        :class="stage <= 9 ? 'border-purple-400 bg-purple-600/30 text-purple-200' : 'border-red-400 bg-red-600/30 text-red-200'"
      >
        <span v-if="stage === 10">👑</span>
        <span v-else>{{ stage }}</span>
      </div>
    </div>
    <div class="text-xs text-center">
      <span class="text-purple-300">1-9단계: 일반 몬스터</span><br>
      <span class="text-red-300">10단계: 최종 보스</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 단계 진행도 표시 컴포넌트
</script> 