<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <!-- 문제 표시 -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-orange-600 mb-2">문제</h2>
      <div class="bg-orange-100 border-2 border-orange-300 rounded-lg p-6">
        <span class="text-4xl font-bold text-orange-800">
          {{ currentQuestion?.korean || '로딩중...' }}
        </span>
      </div>
    </div>
    
    <!-- 선택지 버튼들 -->
    <div class="space-y-4">
      <button
        v-for="(choice, index) in choices"
        :key="index"
        @click="selectAnswer(choice)"
        :disabled="!isPlayerTurn || isGameOver"
        class="w-full py-4 px-6 text-xl font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        :class="getButtonClass(choice)"
      >
        {{ choice }}
      </button>
    </div>
    
    <!-- 게임 상태 표시 -->
    <div class="mt-6 text-center">
      <div class="flex justify-between items-center bg-gray-100 rounded-lg p-4">
        <div>
          <span class="text-sm text-gray-600">점수</span>
          <div class="text-2xl font-bold text-blue-600">{{ score }}</div>
        </div>
        <div>
          <span class="text-sm text-gray-600">레벨</span>
          <div class="text-2xl font-bold text-purple-600">{{ level }}</div>
        </div>
        <div>
          <span class="text-sm text-gray-600">턴</span>
          <div class="text-lg font-semibold" :class="turnColor">
            {{ isPlayerTurn ? '내 턴' : '적 턴' }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- 게임 오버 모달 -->
    <div 
      v-if="isGameOver" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="text-6xl mb-4">
            {{ isPlayerWin ? '🎉' : '💀' }}
          </div>
          <h3 class="text-2xl font-bold mb-2" :class="isPlayerWin ? 'text-green-600' : 'text-red-600'">
            {{ isPlayerWin ? '승리!' : '패배!' }}
          </h3>
          <p class="text-gray-600 mb-4">
            최종 점수: {{ score }}점
          </p>
          <button
            @click="startNewGame"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            다시 시작
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentQuestion: Object,
  choices: Array,
  isPlayerTurn: Boolean,
  isGameOver: Boolean,
  score: Number,
  level: Number,
  isPlayerWin: Boolean
})

const emit = defineEmits(['selectAnswer', 'startNewGame'])

// 버튼 스타일 결정
const getButtonClass = (choice) => {
  const baseClass = 'border-2 font-bold'
  
  if (!props.isPlayerTurn || props.isGameOver) {
    return `${baseClass} bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed`
  }
  
  return `${baseClass} bg-blue-500 border-blue-600 text-white hover:bg-blue-600 hover:border-blue-700 cursor-pointer shadow-lg`
}

// 턴 표시 색상
const turnColor = computed(() => {
  return props.isPlayerTurn ? 'text-green-600' : 'text-red-600'
})

// 이벤트 핸들러
const selectAnswer = (choice) => {
  emit('selectAnswer', choice)
}

const startNewGame = () => {
  emit('startNewGame')
}
</script> 