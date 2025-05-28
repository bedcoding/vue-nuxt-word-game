<template>
  <div class="flex flex-col items-center">
    <!-- 캐릭터 이름 -->
    <h3 class="text-lg font-bold mb-2" :class="nameColor">
      {{ character.name }}
    </h3>
    
    <!-- HP 바 -->
    <div class="w-32 bg-gray-300 rounded-full h-4 mb-4 border-2 border-gray-400">
      <div 
        class="h-full rounded-full transition-all duration-500"
        :class="hpBarColor"
        :style="{ width: hpPercentage + '%' }"
      ></div>
    </div>
    
    <!-- HP 텍스트 -->
    <div class="text-sm text-gray-600 mb-4">
      {{ character.hp }} / {{ character.maxHp }}
    </div>
    
    <!-- 캐릭터 아바타 -->
    <div 
      class="w-24 h-24 rounded-full flex items-center justify-center text-4xl transition-all duration-300"
      :class="[avatarBg, { 'animate-bounce': isAttacking, 'animate-pulse': isHurt }]"
    >
      {{ isPlayer ? '🛡️' : '👾' }}
    </div>
    
    <!-- 데미지/치유 표시 -->
    <div 
      v-if="showDamage" 
      class="absolute text-2xl font-bold animate-bounce"
      :class="damageColor"
    >
      {{ damageText }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  character: {
    type: Object,
    required: true
  },
  isPlayer: {
    type: Boolean,
    default: false
  },
  isAttacking: {
    type: Boolean,
    default: false
  }
})

// 반응형 상태
const showDamage = ref(false)
const damageText = ref('')
const isHurt = ref(false)
const lastHp = ref(props.character.hp)

// 컴포넌트가 마운트될 때 초기 HP 설정
lastHp.value = props.character.hp

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
  lastHp.value = newHp
})

// 데미지 이펙트 표시
const showDamageEffect = (type) => {
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
</style> 