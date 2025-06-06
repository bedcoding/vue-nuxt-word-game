<template>
  <div class="absolute inset-0 pointer-events-none">
    <div 
      v-for="n in 20" 
      :key="n"
      class="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-twinkle"
      :style="{ 
        left: Math.random() * 100 + '%', 
        top: Math.random() * 100 + '%',
        animationDelay: Math.random() * 3 + 's'
      }"
    ></div>
  </div>
</template>

<style scoped>
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.animate-twinkle {
  animation: twinkle 2s infinite;
}
</style>

<script setup lang="ts">
// 별빛 효과 컴포넌트
</script> 