<template>
  <div class="mt-6 p-4 bg-blue-900/30 border border-blue-400/30 rounded-lg">
    <h4 class="text-lg font-semibold text-blue-200 mb-3 text-center">📚 출제될 단어들</h4>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
      <div 
        v-for="word in words"
        :key="word.korean"
        class="text-center p-2 bg-blue-800/30 rounded"
      >
        <div class="text-white font-medium">{{ word.korean }}</div>
        <div class="text-blue-300 text-xs">{{ word.english }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Word } from '@/types/game'

interface Props {
  words: Word[]
}

defineProps<Props>()
</script> 