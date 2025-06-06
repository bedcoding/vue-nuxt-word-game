<template>
  <button
    @click="goBack"
    class="bg-gray-800/80 hover:bg-gray-700/80 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
  >
    ← 뒤로가기
  </button>
</template>

<script setup lang="ts">
interface Props {
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  to: '/'
})

const goBack = () => {
  navigateTo(props.to)
}
</script> 