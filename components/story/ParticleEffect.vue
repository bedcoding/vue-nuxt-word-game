<template>
  <div class="absolute inset-0 pointer-events-none">
    <div 
      v-for="n in 15" 
      :key="n"
      class="absolute w-2 h-2 bg-purple-400/30 rounded-full animate-float"
      :style="{ 
        left: Math.random() * 100 + '%', 
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 5 + 's',
        animationDuration: (3 + Math.random() * 2) + 's'
      }"
    ></div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
</style>

<script setup lang="ts">
// 스토리 파티클 효과 컴포넌트
</script> 