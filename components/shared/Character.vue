<template>
  <div class="flex flex-col items-center">
    <!-- 캐릭터 이름 -->
    <h3 class="text-lg font-bold mb-2" :class="nameColor">
      {{ character.name }}
    </h3>
    
    <!-- HP 바 -->
    <div class="w-32 bg-gray-800/80 rounded-full h-4 mb-2 border-2 border-gray-500/50 shadow-lg">
      <div 
        class="h-full rounded-full transition-all duration-500 shadow-inner"
        :class="hpBarColor"
        :style="{ width: hpPercentage + '%' }"
      ></div>
    </div>
    
    <!-- HP 텍스트 -->
    <div class="text-sm font-bold mb-4 drop-shadow-lg" :class="hpTextColor">
      {{ character.hp }} / {{ character.maxHp }}
    </div>
    
    <!-- 캐릭터 아바타 컨테이너 -->
    <div class="relative">
      <!-- 캐릭터 아바타 -->
      <div 
        class="w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all duration-300"
        :class="[avatarBg, { 'animate-bounce': isAttacking, 'animate-pulse': isHurt }]"
      >
        {{ isPlayer ? '🛡️' : '👾' }}
      </div>
      
      <!-- 데미지/치유 표시 (캐릭터 옆에 표시) -->
      <div 
        v-if="showDamage" 
        class="absolute text-3xl font-bold animate-damage z-10 bg-black/80 rounded-full px-3 py-1 border-2 shadow-lg"
        :class="[
          damageColor, 
          isPlayer ? '-right-16 top-2' : '-left-16 top-2',
          damageText.startsWith('-') ? 'border-red-400' : 'border-green-400'
        ]"
      >
        {{ damageText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Player, Enemy } from '@/types/game'

interface Props {
  character: Player | Enemy
  isPlayer?: boolean
  isAttacking?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isPlayer: false,
  isAttacking: false
})

// 반응형 상태
const showDamage = ref(false)
const damageText = ref('')
const isHurt = ref(false)

// HP 변화 감지
watch(() => props.character.hp, (newHp, oldHp) => {
  if (newHp < oldHp) {
    // 데미지 받음
    const damage = oldHp - newHp
    damageText.value = `-${damage}`
    showDamageEffect('damage')
  } else if (newHp > oldHp) {
    // 치유
    const heal = newHp - oldHp
    damageText.value = `+${heal}`
    showDamageEffect('heal')
  }
})

// 데미지 이펙트 표시
const showDamageEffect = (type: 'damage' | 'heal'): void => {
  showDamage.value = true
  isHurt.value = type === 'damage'
  
  setTimeout(() => {
    showDamage.value = false
    isHurt.value = false
  }, 1000)
}

// 계산된 속성들
const hpPercentage = computed(() => {
  return (props.character.hp / props.character.maxHp) * 100
})

const hpBarColor = computed(() => {
  const percentage = hpPercentage.value
  if (percentage > 60) return 'bg-green-500'
  if (percentage > 30) return 'bg-yellow-500'
  return 'bg-red-500'
})

const nameColor = computed(() => {
  return props.isPlayer ? 'text-blue-600' : 'text-red-600'
})

const avatarBg = computed(() => {
  return props.isPlayer ? 'bg-blue-100 border-4 border-blue-300' : 'bg-red-100 border-4 border-red-300'
})

const damageColor = computed(() => {
  return damageText.value.startsWith('-') ? 'text-red-500' : 'text-green-500'
})

const hpTextColor = computed(() => {
  const percentage = hpPercentage.value
  if (percentage > 60) return 'text-green-300'
  if (percentage > 30) return 'text-yellow-300'
  return 'text-red-300'
})
</script>

<style scoped>
.animate-bounce {
  animation: bounce 0.5s;
}

.animate-pulse {
  animation: pulse 0.5s;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes damage {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translateY(-40px) scale(0.8);
    opacity: 0;
  }
}

.animate-damage {
  animation: damage 1s ease-out;
}
</style> 