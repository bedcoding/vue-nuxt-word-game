// 🔧 Nuxt 3 자동 임포트 함수들의 TypeScript 타입 선언

declare global {
  // 네비게이션 함수
  const navigateTo: (url: string, options?: {
    replace?: boolean
    redirectCode?: number
    external?: boolean
  }) => Promise<void>
  
  // 에러 생성 함수
  const createError: (options: {
    statusCode?: number
    statusMessage?: string
    data?: any
  }) => Error
  
  // 헤드 설정 함수
  const useHead: (head: {
    title?: string
    meta?: Array<{ name: string; content: string }>
  }) => void
}

export {} 