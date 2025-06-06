<template>
  <div class="bg-black/30 rounded-lg p-3 text-center">
    <div class="text-xs text-purple-300 mb-1">첫 번째 적</div>
    <div class="text-white font-semibold">{{ enemy.name }}</div>
    <div class="text-xs text-red-300">HP: {{ enemy.hp }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Enemy } from '@/types/game'

interface Props {
  enemy: Enemy
}

defineProps<Props>()
</script> 