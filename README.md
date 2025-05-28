# Nuxt.js + Pinia 데모 프로젝트 🚀

Vue.js 3, Nuxt.js 3, Pinia를 사용한 기본 상태 관리 데모 프로젝트입니다.

## 🛠 기술 스택

- **Nuxt.js 3** - Vue.js 기반 풀스택 프레임워크
- **Vue.js 3** - 프론트엔드 프레임워크
- **Pinia** - Vue.js 공식 상태 관리 라이브러리
- **Tailwind CSS** - 유틸리티-퍼스트 CSS 프레임워크
- **TypeScript** - 타입 안전성을 위한 언어

## 📦 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 빌드
yarn build

# 프로덕션 실행
yarn preview
```

## 🎯 주요 기능

### 1. 카운터 예제
- **기본 상태 관리**: 숫자 값의 증가/감소
- **Getters 사용**: 계산된 값 (doubleCount, isPositive)
- **Actions**: increment, decrement, reset, setCount

### 2. 할 일 목록 예제
- **복잡한 상태 관리**: 배열 기반 데이터 관리
- **필터링**: 전체/진행중/완료 필터
- **CRUD 작업**: 추가, 수정, 삭제
- **통계**: 활성/완료 항목 개수

## 📁 프로젝트 구조

```
├── components/           # Vue 컴포넌트
│   ├── Counter.vue      # 카운터 컴포넌트
│   └── TodoList.vue     # 할 일 목록 컴포넌트
├── stores/              # Pinia 스토어
│   ├── counter.ts       # 카운터 스토어
│   └── todos.ts         # 할 일 목록 스토어
├── app.vue              # 메인 앱 컴포넌트
├── nuxt.config.ts       # Nuxt 설정
└── package.json         # 의존성 정보
```

## 🔧 Pinia 스토어 패턴

### 기본 구조
```typescript
import { defineStore } from 'pinia'

export const useMyStore = defineStore('myStore', {
  state: () => ({
    // 상태 정의
  }),
  
  getters: {
    // 계산된 값 (computed와 유사)
  },
  
  actions: {
    // 메소드 (상태 변경 로직)
  }
})
```

### 컴포넌트에서 사용
```vue
<script setup>
import { useMyStore } from '@/stores/myStore'

const store = useMyStore()

// 상태 접근: store.state
// Getter 접근: store.computedValue
// Action 호출: store.actionMethod()
</script>
```

## 🎨 Tailwind CSS 사용

rem 단위를 사용한 반응형 디자인:
```css
/* 예시 */
.container {
  padding: 1.5rem;  /* 24px */
  margin: 2rem auto; /* 32px auto */
}
```

## 📚 학습 포인트

### Vue.js 3 특징
- **Composition API**: `<script setup>` 문법
- **반응형 시스템**: `ref()`, `computed()` 
- **자동 import**: Nuxt의 자동 import 기능

### Pinia vs Vuex
- 더 간단한 API
- 타입스크립트 지원 강화
- 모듈식 구조 (네임스페이스 불필요)
- 개발자 도구 지원

### Nuxt.js 3 장점
- **파일 기반 라우팅**: `pages/` 폴더 구조
- **자동 import**: 컴포넌트, 컴포저블, 유틸리티
- **서버사이드 렌더링**: SEO 최적화
- **정적 사이트 생성**: `nuxt generate`

## 🔗 참고 링크

- [Nuxt.js 공식 문서](https://nuxt.com/)
- [Pinia 공식 문서](https://pinia.vuejs.org/)
- [Vue.js 3 공식 문서](https://vuejs.org/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/)

## 🚀 다음 단계

1. **API 연동**: `$fetch` 또는 `useFetch` 사용
2. **라우팅**: `pages/` 폴더로 멀티페이지 구성
3. **미들웨어**: 인증, 권한 관리
4. **플러그인**: 외부 라이브러리 통합
5. **서버 API**: `server/api/` 폴더로 백엔드 API 구성

---

💡 **팁**: React/Next.js 경험이 있다면 Nuxt.js는 매우 빠르게 익힐 수 있습니다!
