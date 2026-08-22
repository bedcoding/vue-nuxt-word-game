<template>
  <!-- 장식 요소. 스크린리더에서 숨기고 클릭도 통과시킨다 -->
  <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
    <div
      v-for="(star, index) in stars"
      :key="index"
      class="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-twinkle"
      :style="star"
    ></div>
  </div>
</template>

<script setup lang="ts">
// 좌표는 마운트 후에 한 번만 계산한다 (하이드레이션 불일치 방지)
const stars = useRandomParticles(20, { maxDelay: 3 })
</script>

<style scoped>
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.animate-twinkle {
  animation: twinkle 2s infinite;
}
</style>
