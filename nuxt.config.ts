import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],

  // Tailwind v4는 Vite 플러그인 + CSS 진입점만으로 동작한다.
  // @nuxtjs/tailwindcss 모듈은 쓰지 않는다 — v4용 7.x 라인이 계속 beta에
  // 머물러 있고, Nuxt 3/4 중 어느 쪽을 쓰느냐에 따라 강제로 버전이 갈린다.
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [tailwindcss()]
  },

  app: {
    head: {
      // 스크린리더가 한국어로 읽도록 문서 언어를 명시한다
      htmlAttrs: { lang: 'ko' }
    }
  },

  runtimeConfig: {
    // 서버 전용 값 (public이 아니므로 클라이언트 번들에 들어가지 않는다)

    // NUXT_OPENAI_API_KEY 로 주입. 기존 배포 호환을 위해 OPENAI_API_KEY 도 읽는다.
    // (server/api/generate-story-stream.post.ts 참고)
    openaiApiKey: '',

    // 요청이 도착한 host는 항상 허용되므로, 별도 도메인이 필요할 때만 채운다.
    // 쉼표로 구분: NUXT_ALLOWED_ORIGINS="https://a.example,https://b.example"
    allowedOrigins: ''
  }
})
