# ⚔️ 단어 배틀 (Word Battle) 🎮

## 🌐 **게임 플레이 데모**
> **🚀 https://vue-nuxt-word-game.vercel.app/**

스토리 기반의 턴제 영어 단어 학습 게임입니다.  
Vue.js 3, Nuxt.js 3, Pinia를 활용한 인터랙티브 학습 게임 프로젝트입니다.

## 🎯 게임 소개

**단어 배틀**은 영어 학습과 RPG 전투 시스템을 결합한 웹 게임입니다.  
플레이어는 **3개 지역, 각 지역당 10단계**의 스토리 기반 어드벤처를 진행하며, 적과 1:1 턴제 전투를 벌입니다.

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
- **TypeScript** - 타입 안정성 확보

## 📁 프로젝트 구조

```
📦 프로젝트 루트
├── 📁 server/              # 백엔드 API 서버
│   ├── 📁 api/             # REST API 엔드포인트
│   │   └── 📄 generate-story-stream.post.ts  # POST /api/generate-story-stream (AI 스토리 생성)
│   └── 📄 tsconfig.json    # 서버 TypeScript 설정
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

#### 📡 API 엔드포인트 예시
- `server/api/chat.post.js` → `POST /api/chat`
- `server/api/users.get.js` → `GET /api/users` (예시)
- `server/api/game/[id].delete.js` → `DELETE /api/game/:id` (예시)

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
```

### 🔑 API 설정

**AI 스토리 생성 기능**을 위해 OpenAI API 연동이 필요합니다.

1. **OpenAI API 키 발급**: [OpenAI 플랫폼](https://platform.openai.com/)에서 API 키를 발급받으세요.

2. **환경 변수 설정**: 프로젝트 루트에 `.env` 파일을 생성하고 다음과 같이 설정하세요:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

3. **API 기능**: 
   - **AI 스토리 생성**: 각 단계마다 고유한 스토리 자동 생성
   - **스트리밍 방식**: 실시간으로 텍스트가 타이핑되는 효과
   - **컨텍스트 연계**: 이전 스토리와 자연스럽게 연결
   - **폴백 시스템**: API 실패 시 하드코딩된 스토리 사용

### 🛡️ API 보안 설정

1. **HTTP Method 검증**: POST 요청만 허용
2. **Origin/Referer 검증**: CSRF 공격 방지
3. **지능적 레이트 리미팅**: 
   - 🔥 **단기 (1분)**: 6번 요청 허용 (버스트 트래픽 대응)
   - ⚡ **중기 (10분)**: 30번 요청 허용 (지속적 사용)
   - 🛡️ **장기 (1시간)**: 120번 요청 허용 (남용 방지)
4. **유연한 입력값 검증**: 메시지 길이 제한 (게임 특성 고려)
5. **의심스러운 패턴 감지**: SQL Injection, XSS 등 공격 시도 차단


### 🌐 Vercel 배포

```bash
# Vercel로 배포
npm i -g vercel
vercel

# 환경 변수는 Vercel 대시보드에서 설정:
# Settings > Environment Variables > OPENAI_API_KEY 추가
```