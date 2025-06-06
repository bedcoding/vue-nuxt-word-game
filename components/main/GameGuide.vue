<template>
  <div class="mt-8 bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-sm border border-blue-400/30 rounded-xl p-6">
    <h3 class="text-lg font-bold text-blue-200 mb-3 text-center">🎮 게임 진행 방식</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-100">
      <div class="flex items-center justify-center gap-3">
        <span class="text-xl">📖</span>
        <div class="text-left">
          <div class="font-semibold">스토리 → 전투 반복</div>
          <div class="text-xs text-blue-300">각 단계마다 스토리를 읽고 전투 진행</div>
        </div>
      </div>
      <div class="flex items-center justify-center gap-3">
        <span class="text-xl">🎯</span>
        <div class="text-left">
          <div class="font-semibold">총 10단계 클리어</div>
          <div class="text-xs text-blue-300">9단계 일반 몬스터 + 1단계 최종 보스</div>
        </div>
      </div>
      <div class="flex items-center justify-center gap-3">
        <span class="text-xl">💊</span>
        <div class="text-left">
          <div class="font-semibold">단계별 HP 회복</div>
          <div class="text-xs text-blue-300">각 단계 클리어 시 체력을 20씩 회복</div>
        </div>
      </div>
      <div class="flex items-center justify-center gap-3">
        <span class="text-xl">👑</span>
        <div class="text-left">
          <div class="font-semibold">최종 보스전</div>
          <div class="text-xs text-blue-300">10단계에서 강력한 보스와 최후 결전!</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 게임 설명 컴포넌트
</script> 