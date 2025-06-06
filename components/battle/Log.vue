<template>
  <div class="bg-black bg-opacity-50 rounded-lg p-4 max-h-40 overflow-y-auto">
    <h3 class="text-white font-bold mb-2">⚡ 전투 로그</h3>
    <div class="space-y-1">
      <div 
        v-for="(log, index) in battleLogs" 
        :key="index"
        class="text-sm text-white opacity-90"
      >
        {{ log }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const battleLogs = ref<string[]>([])

// 전투 로그 추가
const addBattleLog = (message: string) => {
  battleLogs.value.push(message)
  
  // 로그가 너무 많아지면 오래된 것 제거
  if (battleLogs.value.length > 10) {
    battleLogs.value.shift()
  }
}

// 부모 컴포넌트에서 로그 추가할 수 있도록 expose
defineExpose({
  addBattleLog
})
</script>

<style scoped>
/* 스크롤바 스타일링 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style> 