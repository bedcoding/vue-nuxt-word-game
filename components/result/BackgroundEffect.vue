<template>
  <div>
    <!-- 승리 시 색종이 효과 -->
    <div v-if="isPlayerWin" class="absolute inset-0 pointer-events-none">
      <div 
        v-for="(confetti, index) in confettiData" 
        :key="index"
        class="absolute w-2 h-6 animate-confetti"
        :class="confetti.color"
        :style="confetti.style"
      ></div>
    </div>
    
    <!-- 패배 시 어둠 효과 -->
    <div v-else class="absolute inset-0 pointer-events-none">
      <div 
        v-for="(particle, index) in failureParticles" 
        :key="index"
        class="absolute w-4 h-4 bg-red-500/20 rounded-full animate-pulse"
        :style="particle.style"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const isPlayerWin = computed(() => gameStore.isPlayerWin)
const isRegionComplete = computed(() => gameStore.currentStageNumber === 10 && isPlayerWin.value)

// 🔧 미리 계산된 색종이 데이터
const confettiData = computed(() => {
  const count = isRegionComplete.value ? 50 : 30
  const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400', 
    'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'
  ]
  
  return Array.from({ length: count }, (_, index) => ({
    color: colors[index % colors.length],
    style: {
      left: Math.random() * 100 + '%',
      top: '-20px', // 🔧 초기 위치를 화면 위로 명시적 설정
      animationDelay: Math.random() * 3 + 's',
      animationDuration: (2 + Math.random() * 3) + 's'
    }
  }))
})

// 🔧 미리 계산된 패배 파티클 데이터
const failureParticles = computed(() => {
  return Array.from({ length: 10 }, () => ({
    style: {
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animationDelay: Math.random() * 2 + 's'
    }
  }))
})
</script>

<style scoped>
@keyframes confetti {
  0% { 
    transform: translateY(-100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% { 
    transform: translateY(100vh) rotate(720deg);
    opacity: 1;
  }
}

.animate-confetti {
  animation: confetti linear infinite;
  /* 🔧 초기 상태 강제 설정 */
  transform: translateY(-100vh);
}
</style> 