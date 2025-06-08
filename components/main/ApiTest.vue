<template>
  <div class="mt-4">
    <button
      @click="testChatGPT"
      :disabled="isTestingAPI"
      class="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
    >
      {{ isTestingAPI ? '🔄 테스트 중 🔄' : '🤖 ChatGPT API 테스트' }}
    </button>
    <p class="text-xs text-gray-400 mt-1">콘솔에서 결과 확인</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isTestingAPI = ref<boolean>(false)

// API 응답 타입 정의
interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

interface APIResponse {
  success: boolean;
  message?: string;
  usage?: TokenUsage;
  error?: string;
}

interface APIRequestBody {
  message: string;
}

// API 테스트 함수
const testChatGPT = async (): Promise<void> => {
  if (isTestingAPI.value) return
  
  isTestingAPI.value = true
  
  try {
    console.log('🚀 ChatGPT API 테스트 시작')
    
    const requestBody: APIRequestBody = {
      message: '안녕하세요! API 연결 테스트입니다.'
    }
    
    const response = await $fetch<APIResponse>('/api/chat', {
      method: 'POST',
      body: requestBody
    })
    
    if (response.success) {
      console.log('✅ API 테스트 성공!')
      console.log('📝 응답 메시지:', response.message)
      console.log('📊 토큰 사용량:', response.usage)
    } else {
      console.error('❌ API 테스트 실패:', response.error)
    }
    
  } catch (error) {
    console.error('💥 API 호출 오류:', error)
  } finally {
    isTestingAPI.value = false
  }
}
</script> 