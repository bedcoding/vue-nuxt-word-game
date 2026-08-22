<template>
  <div>
    <!-- pages/ 폴더의 파일들이 자동으로 라우트가 된다 -->
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Nuxt 3 파일 기반 라우팅 사용
// - pages/index.vue   -> /
// - pages/story.vue   -> /story
// - pages/battle.vue  -> /battle
// - pages/victory.vue -> /victory
// - pages/defeat.vue  -> /defeat
</script>

<style>
/*
 * 모션 최소화 설정을 켠 사용자에게는 애니메이션을 사실상 끈다.
 * 이 게임은 파티클/펄스/색종이 애니메이션이 많아서 어지럼증(vestibular disorder)을
 * 유발할 수 있다. 컴포넌트마다 처리하는 대신 여기서 한 번에 덮는다.
 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>
