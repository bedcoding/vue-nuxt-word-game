<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black relative overflow-hidden">
    <!-- 배경 효과 -->
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
    
    <!-- 메인 콘텐츠 -->
    <div class="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
      <!-- 게임 타이틀 -->
      <MainGameTitle />
      
      <!-- 지역 선택 섹션 -->
      <div class="flex-1 max-w-5xl mx-auto w-full">
        <MainRegionSelector />
        <MainGameGuide />
      </div>
      
      <!-- 하단 정보 -->
      <MainFooter />
    </div>
    
    <!-- 별빛 효과 -->
    <MainStarEffect />
  </div>
</template>

<script setup lang="ts">
// SEO 설정
useHead({
  title: '워드 배틀 - 영어 학습 RPG 게임',
  meta: [
    { name: 'description', content: '영어 단어 학습과 RPG 전투를 결합한 재미있는 웹 게임' }
  ]
})
</script> 