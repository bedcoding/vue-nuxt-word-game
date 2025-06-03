# ⚔️ 단어 배틀 (Word Battle) 🎮

## 🌐 **게임 플레이 데모**
> **🚀 https://vue-nuxt-word-game.vercel.app/**

스토리 기반의 턴제 영어 단어 학습 게임입니다.  
Vue.js 3, Nuxt.js 3, Pinia를 활용한 인터랙티브 학습 게임 프로젝트입니다.

## 🎯 게임 소개

**단어 배틀**은 영어 학습과 RPG 전투 시스템을 결합한 웹 게임입니다.  
플레이어는 적과 1:1 턴제 전투를 벌이며, 한글 단어에 맞는 영어 단어를 선택해 적을 공격합니다.

### 🎮 게임플레이
- **정답 시**: 적을 공격하여 데미지를 입힙니다
- **오답 시**: 플레이어가 적에게 공격당합니다
- **승리 조건**: 적의 HP를 0으로 만들기
- **패배 조건**: 플레이어의 HP가 0이 되면 게임 오버

## 🛠 기술 스택

- **Nuxt.js 3** - Vue.js 기반 풀스택 프레임워크
- **Vue.js 3** - Composition API 활용
- **Pinia** - 상태 관리 라이브러리
- **Tailwind CSS** - 유틸리티-퍼스트 CSS (rem 단위 사용)
- **TypeScript** - 타입 안전성

## 📁 프로젝트 구조

```
📦 프로젝트 루트
├── 📁 server/              # 백엔드 API 서버
│   ├── 📁 api/             # REST API 엔드포인트
│   │   └── 📄 chat.post.js  # POST /api/chat (ChatGPT API)
│   └── 📄 tsconfig.json    # 서버 TypeScript 설정
├── 📁 components/          # Vue 컴포넌트
├── 📁 stores/              # Pinia 상태 관리
├── 📁 public/              # 정적 파일 (이미지, 아이콘 등)
├── 📄 app.vue              # 루트 컴포넌트
├── 📄 nuxt.config.ts       # Nuxt 설정 파일
└── 📄 package.json         # 프로젝트 의존성
```

### 🔄 Nuxt 3 풀스택 원리

이 프로젝트는 **Nuxt 3의 풀스택 기능**을 활용하여 하나의 명령어로 프론트엔드와 백엔드를 동시에 실행합니다:

#### 🎯 핵심 원리
- **Nitro 서버 엔진**: 프론트엔드(Vue 3)와 백엔드 API를 동일한 프로세스에서 실행
- **자동 API 라우팅**: `server/api/` 폴더의 파일들이 자동으로 REST API 엔드포인트로 변환
- **파일 기반 라우팅**: `[name].[method].js` 규칙으로 API 경로 자동 생성

#### 🚀 실행 과정
```bash
yarn dev  # 하나의 명령어로
```
1. **프론트엔드 서버** 시작 (Vue 3 + SSR)
2. **백엔드 API 서버** 동시 실행 (Nitro)
3. `/api/*` 경로는 서버 API로, 나머지는 프론트엔드로 자동 라우팅

#### 📡 API 엔드포인트 예시
- `server/api/chat.post.js` → `POST /api/chat`
- `server/api/users.get.js` → `GET /api/users` (예시)
- `server/api/game/[id].delete.js` → `DELETE /api/game/:id` (예시)

이러한 구조로 **별도의 백엔드 서버 설정 없이도** 풀스택 웹 애플리케이션을 개발할 수 있습니다! 🎉

## 🚀 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/bedcoding/vue-nuxt-word-game.git
cd vue-nuxt-word-game

# 의존성 설치
npm install
# 또는
yarn install

# 환경 변수 설정 (ChatGPT API 사용시)
# .env 파일을 루트 디렉토리에 생성하고 다음 내용 추가:
# OPENAI_API_KEY=sk-your-openai-api-key-here

# 개발 서버 실행 (http://localhost:3000)
npm run dev
# 또는
yarn dev

# 빌드
npm run build
yarn build

# 프로덕션 실행
npm run preview
yarn preview
```

### 🔑 API 설정

현재 ChatGPT API도 연동중입니다.

1. **OpenAI API 키 발급**: [OpenAI 플랫폼](https://platform.openai.com/)에서 API 키를 발급받으세요.

2. **환경 변수 설정**: 프로젝트 루트에 `.env` 파일을 생성하고 다음과 같이 설정하세요:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

3. **API 테스트**: 메인 메뉴 하단의 "🤖 ChatGPT API 테스트" 버튼으로 연결 상태를 확인할 수 있습니다.

### 🛡️ API 보안 설정

**⚠️ 중요**: API 엔드포인트는 기본적으로 **외부에서 접근 가능**하므로 보안 설정이 필수입니다!

#### 🔒 적용된 보안 기능들

1. **HTTP Method 검증**: POST 요청만 허용
2. **Origin/Referer 검증**: CSRF 공격 방지
3. **지능적 레이트 리미팅**: 
   - 🔥 **단기 (1분)**: 20번 요청 허용 (버스트 트래픽 대응)
   - ⚡ **중기 (10분)**: 100번 요청 허용 (지속적 사용)
   - 🛡️ **장기 (1시간)**: 300번 요청 허용 (남용 방지)
4. **유연한 입력값 검증**: 메시지 길이 2000자 제한 (게임 특성 고려)
5. **의심스러운 패턴 감지**: SQL Injection, XSS 등 공격 시도 차단
6. **에러 메시지 제한**: 민감한 정보 노출 방지

#### 📊 실제 사용량 시나리오

**👥 정상적인 서비스 이용 (안전)**:
```
🎮 게임 플레이어 1: 5분간 게임 → 약 10번 API 호출 ✅
🎮 게임 플레이어 2: 같은 시간, 같은 공용 IP → 추가 10번 호출 ✅
🎮 총 20번/1분, 40번/10분 → 모두 허용됨! 
```

**🚨 의심스러운 남용 (차단)**:
```
🤖 봇/스크립트: 1분에 25번 연속 호출 → 차단! ❌
💸 API 남용: 1시간에 350번 호출 → 차단! ❌
🔍 해킹 시도: SQL injection 패턴 → 즉시 차단! ❌
```

**💡 똑똑한 제한 시스템**:
- **정상 사용자**: 자유롭게 게임 플레이 가능 🎯
- **악의적 사용자**: 효과적으로 차단 🛡️
- **메모리 효율성**: 1시간 이전 기록은 자동 삭제 🧹

#### 🚨 추가 보안 방법들

**1. 환경 변수로 도메인 제한**
```env
# .env 파일에 추가
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

**2. API 키 인증 (선택사항)**
```javascript
// 클라이언트에서 헤더 추가
const response = await $fetch('/api/chat', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your-secret-key'
  },
  body: { message: '메시지' }
})
```

**3. JWT 토큰 인증 (고급)**
- 사용자 로그인 시 JWT 토큰 발급
- API 호출 시 토큰 검증

**4. CloudFlare/AWS WAF 사용**
- DDoS 방어
- 지역별 접근 제한
- Bot 탐지 및 차단

#### 💰 비용 절약 팁

```javascript
// API 호출 최적화
max_tokens: 100,        // 토큰 수 제한
temperature: 0.7,       // 응답 일관성 증가
model: 'gpt-4o-mini'   // 비용 효율적 모델 사용
```

#### 📊 모니터링 권장사항

1. **API 사용량 모니터링**: OpenAI 대시보드에서 일일 사용량 체크
2. **로그 분석**: 비정상적인 요청 패턴 감지
3. **알림 설정**: 비용 임계값 초과 시 알림

### 🌐 배포 (Vercel 권장)

```bash
# Vercel로 배포
npm i -g vercel
vercel

# 환경 변수는 Vercel 대시보드에서 설정:
# Settings > Environment Variables > OPENAI_API_KEY 추가
```

## 🎨 주요 기능

### ⚔️ 전투 시스템
- **실시간 HP 바**: 플레이어와 적의 체력 시각화
- **데미지 애니메이션**: 공격 시 바운스 효과
- **턴제 시스템**: 플레이어 턴 / 적 턴 구분

### 📚 학습 시스템  
- **한글-영어 단어 매칭**: 10개의 기본 단어 세트
- **3지선다 문제**: 정답 1개 + 오답 2개 랜덤 배치
- **즉시 피드백**: 정답/오답 여부 실시간 표시

### 🎯 게임 요소
- **점수 시스템**: 정답 시 10점, 승리 시 50점 보너스
- **전투 로그**: 실시간 게임 진행 상황 표시
- **게임 오버 모달**: 승리/패배 결과 및 재시작 기능

## 🔧 핵심 기술 구현

### Pinia 상태 관리
```javascript
// stores/game.js
export const useGameStore = defineStore('game', {
  state: () => ({
    player: { hp: 100, maxHp: 100, name: '용사' },
    enemy: { hp: 80, maxHp: 80, name: '슬라임' },
    currentQuestion: null,
    score: 0
  }),
  
  actions: {
    selectAnswer(selectedAnswer) {
      // 답안 선택 로직
    },
    attackEnemy() {
      // 적 공격 로직
    }
  }
})
```

## 📊 게임 데이터

현재 10개의 기본 단어가 포함되어 있습니다:

| 한글 | 영어 | 오답 선택지 |
|------|------|-------------|
| 사과 | apple | banana, orange |
| 고양이 | cat | dog, bird |
| 책 | book | pen, paper |
| 물 | water | fire, earth |
| 집 | house | car, tree |


## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.