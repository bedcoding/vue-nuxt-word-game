<template>
  <!-- 장식 요소. 스크린리더에서 숨기고 클릭도 통과시킨다 -->
  <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
    <div
      v-for="(particle, index) in particles"
      :key="index"
      class="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-float"
      :style="particle"
    ></div>
  </div>
</template>

<script setup lang="ts">
// 좌표는 마운트 후에 한 번만 계산한다 (하이드레이션 불일치 방지)
const particles = useRandomParticles(15, {
  maxDelay: 5,
  duration: { min: 3, max: 5 }
})
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
</style>
