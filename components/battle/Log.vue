<template>
  <div 
    ref="logContainer"
    class="bg-black/60 backdrop-blur-sm border border-purple-400/30 rounded-lg p-4 max-h-40 overflow-y-auto shadow-lg"
  >
    <h3 class="text-white font-bold mb-2 text-center">⚡ 전투 로그</h3>
    <div class="space-y-1">
      <div 
        v-for="(log, index) in battleLogs" 
        :key="index"
        class="text-sm text-purple-100 leading-relaxed px-2 py-1 rounded bg-black/20"
        :class="{
          'text-green-300': log.includes('✅') || log.includes('🎉'),
          'text-red-300': log.includes('❌') || log.includes('💥') || log.includes('💀'),
          'text-blue-300': log.includes('🛡️') || log.includes('⚔️'),
          'text-yellow-300': log.includes('🎯') || log.includes('📚')
        }"
      >
        {{ log }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const battleLogs = ref<string[]>([])
const logContainer = ref<HTMLElement>()

// 스크롤을 맨 아래로 이동
const scrollToBottom = async () => {
  await nextTick()
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
}

// 전투 로그 추가
const addBattleLog = async (message: string) => {
  battleLogs.value.push(message)
  
  // 로그가 너무 많아지면 오래된 것 제거
  if (battleLogs.value.length > 10) {
    battleLogs.value.shift()
  }
  
  // 새 로그 추가 후 자동 스크롤
  await scrollToBottom()
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