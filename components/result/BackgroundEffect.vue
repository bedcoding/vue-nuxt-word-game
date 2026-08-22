<template>
  <!-- 장식 요소. 스크린리더에서 숨기고 클릭도 통과시킨다 -->
  <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
    <!-- 승리: 색종이가 위에서 떨어진다 -->
    <template v-if="isVictory">
      <div
        v-for="(particle, index) in particles"
        :key="index"
        class="absolute w-2 h-6 animate-confetti"
        :class="CONFETTI_COLORS[index % CONFETTI_COLORS.length]"
        :style="particle"
      ></div>
    </template>

    <!-- 패배: 붉은 잔불이 흐릿하게 깜빡인다 -->
    <template v-else>
      <div
        v-for="(particle, index) in particles"
        :key="index"
        class="absolute w-4 h-4 bg-red-500/20 rounded-full animate-pulse"
        :style="particle"
      ></div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'victory' | 'defeat'
}

const props = withDefaults(defineProps<Props>(), { variant: 'victory' })

const CONFETTI_COLORS = [
  'bg-red-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-purple-400',
  'bg-pink-400'
] as const

// variant는 화면 단위로 고정이라 런타임에 바뀌지 않는다
const isVictory = props.variant === 'victory'

// 좌표는 마운트 후에 한 번만 계산한다 (하이드레이션 불일치 방지)
const particles = useRandomParticles(
  isVictory ? 40 : 12,
  isVictory
    ? { maxDelay: 3, duration: { min: 2, max: 5 }, fixedTop: '-20px' }
    : { maxDelay: 2 }
)
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
  transform: translateY(-100vh);
}
</style>
