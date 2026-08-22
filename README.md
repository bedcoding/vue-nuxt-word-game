# ⚔️ 단어 배틀 (Word Battle) 🎮

## 🌐 **게임 플레이 데모**
> **🚀 https://vue-nuxt-word-game.vercel.app/**

스토리 기반의 턴제 영어 단어 학습 게임입니다.  
Vue.js 3, Nuxt.js 3, Pinia를 활용한 인터랙티브 학습 게임 프로젝트입니다.

## 🎯 게임 소개

**단어 배틀**은 영어 학습과 1:1 턴제 전투 시스템을 결합한 웹 게임입니다.  
플레이어는 **3개 지역, 각 지역당 10단계**의 스토리 기반 어드벤처를 진행합니다.
🤖 **ChatGPT를 활용한 동적 스토리 생성**으로 매번 새로운 스토리를 경험할 수 있습니다.

### 🗺️ 게임 지역
1. **📚 마법 도서관** 
2. **🌀 시간의 미로** 
3. **🏰 어둠의 성** 

### 🎮 게임플레이
- **스토리 모드**: 각 단계마다 AI가 스토리 생성
- **전투 시스템**: 한글 단어에 맞는 영어 단어를 선택해 적 공격
- **정답 시**: 적을 공격하여 데미지를 입힙니다
- **오답 시**: 플레이어가 적에게 공격당합니다
- **승리 조건**: 적의 HP를 0으로 만들기
- **패배 조건**: 플레이어의 HP가 0이 되면 게임 오버

## 🛠 기술 스택
- **Vue.js 3** - 템플릿 문법으로 게임 UI 상태 표현이 React보다 직관적이어서 선택함
- **Nuxt.js 3** - Vue.js 기반 풀스택 프레임워크 (React 생태계의 next.js랑 유사함)
- **Pinia** - 상태 관리 라이브러리
- **Tailwind CSS** - `<style scoped>` 태그에는 애니메이션을 넣고, 정적 스타일은 Tailwind로 처리 (역할 분담)
- **TypeScript** - 타입 안정성 확보 (`yarn typecheck`로 vue-tsc 검사)
- **Vitest** - 스토어 상태 전이 / 보상 계산 / SSE 파싱 유닛 테스트

## 🧩 설계 메모

**스토어는 라우팅을 하지 않습니다.** `stores/game.ts`의 액션은 상태를 바꾸고 "이동할 경로"를 문자열로 돌려줄 뿐이고, 실제 `navigateTo`는 `composables/useGameFlow.ts`가 호출합니다. 덕분에

- 스토어를 라우터/Nuxt 런타임 없이 테스트할 수 있습니다 (`tests/stores/game.spec.ts`).
- 연출용 `setTimeout`이 화면 생명주기에 묶입니다. 예약된 이동은 컴포넌트가 사라질 때 `onScopeDispose`로 전부 취소되므로, 전투 직후 뒤로가기를 눌렀을 때 엉뚱한 페이지로 튕기지 않습니다.

**SSR 하이드레이션 불일치를 만들지 않습니다.** 서버 렌더 결과와 클라이언트 첫 렌더가 달라지면 콘솔에 `Hydration completed but contains mismatches` 가 찍히고 화면이 한 번 깜빡입니다. 원인이 되는 두 가지를 이렇게 처리했습니다.

- **선택지 셔플**: getter에서 매번 섞지 않고, 문제를 뽑을 때 한 번 섞어 `currentChoices` 상태에 저장합니다. 상태는 SSR 페이로드로 전달되므로 서버와 클라이언트가 같은 순서를 그립니다.
- **장식용 파티클 좌표**: 템플릿에서 `Math.random()`을 쓰지 않고 `onMounted`에서 한 번만 계산합니다. 서버는 빈 배열로, 클라이언트 첫 렌더도 빈 배열이라 불일치가 없습니다.

화면 진입 보정(`ensureStoryReady` 등)은 모두 idempotent해서 서버/클라이언트 양쪽에서 실행돼도 같은 결과가 나옵니다.

**AI 스트리밍은 취소와 레이스를 함께 다룹니다.** `AbortController`로 이전 요청을 끊고, `requestId`로 늦게 도착한 응답이 새 상태를 덮어쓰는 것을 막습니다. 서버 쪽도 클라이언트 연결이 끊기면(`req.on('close')`) OpenAI 호출까지 같이 취소해서, 아무도 보지 않을 응답에 토큰을 쓰지 않습니다. SSE 파싱은 UTF-8 디코딩과 줄 분할을 모두 스트리밍으로 처리합니다 — 청크마다 새 `TextDecoder`를 만들면 3바이트짜리 한글이 경계에서 깨집니다.

## 📁 프로젝트 구조

```
📦 프로젝트 루트
├── 📁 server/              # 백엔드 API 서버
│   ├── 📁 api/             # REST API 엔드포인트
│   │   └── 📄 generate-story-stream.post.ts  # POST /api/generate-story-stream (AI 스토리 생성)
│   ├── 📁 middleware/      # 요청 공통 처리
│   │   └── 📄 cors.ts      # /api/* CORS 헤더
│   ├── 📁 utils/           # 서버 유틸 (Nitro 자동 임포트)
│   │   ├── 📄 origin.ts    # Origin 화이트리스트 / 클라이언트 IP
│   │   └── 📄 rateLimit.ts # 레이트리밋
│   └── 📄 tsconfig.json    # 서버 TypeScript 설정
├── 📁 constants/           # 게임 밸런스 수치 (단일 진실 원천)
│   └── 📄 game.config.ts   # 스테이지 수 / 보상 / 데미지 / 연출 지연
├── 📁 composables/         # 재사용 로직 (Nuxt 자동 임포트)
│   ├── 📄 useGameFlow.ts   # 상태 전이 + 화면 이동 + 연출 지연
│   └── 📄 useRandomParticles.ts  # 파티클 좌표 (마운트 후 생성)
├── 📁 utils/               # 순수 함수 (Nuxt 자동 임포트)
│   ├── 📄 random.ts        # Fisher-Yates 셔플 / rng 주입 가능
│   └── 📄 sse.ts           # SSE 스트림 줄 단위 파싱
├── 📁 tests/               # 유닛 테스트 (vitest)
├── 📁 components/          # Vue 컴포넌트
│   ├── 📁 battle/          # 전투 관련 컴포넌트
│   ├── 📁 story/           # 스토리 관련 컴포넌트  
│   ├── 📁 shared/          # 공통 컴포넌트
│   ├── 📁 result/          # 결과 화면 컴포넌트
│   └── 📁 main/            # 메인 화면 컴포넌트
├── 📁 pages/               # 페이지 컴포넌트 (파일 기반 라우팅)
│   ├── 📄 index.vue        # 메인 화면 (지역 선택)
│   ├── 📄 story.vue        # 스토리 화면
│   ├── 📄 battle.vue       # 전투 화면
│   ├── 📄 victory.vue      # 승리 화면
│   └── 📄 defeat.vue       # 패배 화면
├── 📁 stores/              # Pinia 상태 관리
│   └── 📄 game.ts          # 게임 전체 상태 관리
├── 📁 data/                # 게임 데이터
│   └── 📁 regions/         # 지역별 스테이지 데이터
│       ├── 📄 gameLibrary.ts   # 마법 도서관 데이터
│       ├── 📄 gameMaze.ts      # 시간의 미로 데이터  
│       ├── 📄 gameCastle.ts    # 어둠의 성 데이터
│       └── 📄 index.ts         # 지역 데이터 통합
├── 📁 types/               # TypeScript 타입 정의
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

#### 📡 API 엔드포인트
- `server/api/generate-story-stream.post.ts` → `POST /api/generate-story-stream` (실제 사용)
- `server/api/users.get.ts` → `GET /api/users` (파일명 규칙 예시)
- `server/api/game/[id].delete.ts` → `DELETE /api/game/:id` (파일명 규칙 예시)

파일명의 `.post` 접미사가 HTTP 메서드 제한까지 처리하므로, 핸들러 안에서 메서드를 다시 검사할 필요가 없습니다.

이러한 구조로 **별도의 백엔드 서버 설정 없이도** 풀스택 웹 애플리케이션을 개발할 수 있습니다.

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

# 타입 검사
yarn typecheck

# 유닛 테스트 (스토어 상태 전이 / 보상 계산 / SSE 파싱)
yarn test
```

### 🔑 API 설정

**AI 스토리 생성 기능**을 위해 OpenAI API 연동이 필요합니다.

1. **OpenAI API 키 발급**: [OpenAI 플랫폼](https://platform.openai.com/)에서 API 키를 발급받으세요.

2. **환경 변수 설정**: 프로젝트 루트에 `.env` 파일을 생성하고 다음과 같이 설정하세요:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here

   # 배포 도메인 외에 추가로 허용할 Origin이 있을 때만 (쉼표 구분)
   # 요청이 도착한 host는 자동으로 허용되므로 보통 비워둡니다.
   # NUXT_ALLOWED_ORIGINS=https://example.com
   ```

3. **API 기능**: 
   - **AI 스토리 생성**: 각 단계마다 고유한 스토리 자동 생성
   - **스트리밍 방식**: 실시간으로 텍스트가 타이핑되는 효과
   - **컨텍스트 연계**: 이전 스토리와 자연스럽게 연결
   - **폴백 시스템**: API 실패 시 하드코딩된 스토리 사용 (키가 없어도 게임은 정상 동작)

### 🛡️ API 보호 장치와 그 한계

이 엔드포인트는 서버가 들고 있는 OpenAI 키를 사용합니다. 즉 **누가 호출할 수 있는지가 곧 비용 문제**입니다.

**1차 방어선 — Origin 화이트리스트** (`server/utils/origin.ts`)
- **Origin 헤더가 없는 요청을 차단합니다.** 브라우저는 GET/HEAD가 아닌 요청에 항상 Origin을 붙이므로(동일 출처 POST 포함), Origin이 없다는 것은 브라우저에서 온 요청이 아니라는 뜻입니다.
  이 검사를 `if (origin && ...)` 로 두면 `curl`처럼 Origin을 보내지 않는 호출이 전부 통과해 엔드포인트가 사실상 공개 OpenAI 프록시가 됩니다.
- 허용 목록은 두 가지 모드로 동작합니다.
  - `NUXT_ALLOWED_ORIGINS` 를 설정하면 **그 목록만** 허용합니다(엄격 모드). 판정이 요청 헤더에 전혀 의존하지 않으므로 가장 안전합니다. **배포 도메인이 고정됐다면 이 모드를 쓰세요.**
  - 설정하지 않으면 요청이 도착한 host를 허용합니다(관용 모드). Vercel 프리뷰처럼 도메인이 매번 바뀌는 환경을 위한 편의 장치이고, 그만큼 Host 헤더를 신뢰하게 되므로 엄격 모드보다 약합니다.

**2차 방어선 — 레이트리밋** (`server/utils/rateLimit.ts`)
- 1분 6회 / 10분 30회 / 1시간 120회.
- ⚠️ **인메모리 구현이라 서버리스에서는 완전하지 않습니다.** Vercel Functions는 인스턴스가 여러 개 뜨고 콜드스타트마다 메모리가 초기화되므로, 병렬로 때리는 의도적 남용은 막지 못합니다. 그걸 막으려면 카운터를 Redis/KV로 옮겨야 합니다. 여기서는 "실수로 연타하는 사용자" 방지용 보조 장치로만 둡니다.

**입력 검증**
- 요청 본문은 `stageNumber`와 `regionId` **두 개만** 받습니다. 이전 맥락과 적 이름은 서버가 지역 데이터에서 직접 유도합니다.
- 클라이언트 문자열이 프롬프트에 들어가지 않으므로 프롬프트 인젝션 경로가 없고, 문자열 패턴 필터(SQL/XSS 키워드 차단 같은 것)도 필요하지 않습니다. 애초에 이 서비스에는 SQL도 없고 사용자 입력을 HTML로 렌더하지도 않습니다.

**CORS** (`server/middleware/cors.ts`)
- 허용 목록에 있는 Origin만 반사하고 `Vary: Origin`을 붙입니다. `Access-Control-Allow-Origin: *` 와 화이트리스트를 동시에 쓰면 정책이 서로 모순됩니다.


### 🌐 Vercel 배포

```bash
# Vercel로 배포
npm i -g vercel
vercel

# 환경 변수는 Vercel 대시보드에서 설정:
# Settings > Environment Variables > OPENAI_API_KEY 추가
```