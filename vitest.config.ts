import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

/**
 * 스토어/유틸 유닛 테스트용 설정.
 * Nuxt 런타임 없이 순수 로직만 검증하므로 별도 환경 설정이 필요 없다.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '~': fileURLToPath(new URL('./', import.meta.url))
    }
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts']
  }
})
