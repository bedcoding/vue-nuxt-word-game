# ⚔️ 단어 배틀 (Word Battle) 🎮

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