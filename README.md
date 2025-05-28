# ⚔️ 단어 배틀 (Word Battle) 🎮

다키스트 던전 스타일의 턴제 영어 단어 학습 게임입니다.  
Vue.js 3, Nuxt.js 3, Pinia를 활용한 인터랙티브 학습 게임 프로젝트입니다.

![게임 스크린샷](https://via.placeholder.com/800x400/6366f1/ffffff?text=Word+Battle+Game)

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

## 📁 프로젝트 구조

```
├── components/
│   ├── Character.vue       # 캐릭터 컴포넌트 (HP바, 애니메이션)
│   ├── GameBoard.vue       # 메인 게임 화면
│   └── QuestionPanel.vue   # 문제 표시 및 선택지 패널
├── stores/
│   └── game.js            # Pinia 게임 상태 관리
├── app.vue                # 메인 앱 컴포넌트
├── nuxt.config.ts         # Nuxt 설정
└── package.json           # 의존성 정보
```

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

### Vue 3 Composition API
```vue
<script setup>
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()

const handleAnswer = (answer) => {
  gameStore.selectAnswer(answer)
}
</script>
```

### Tailwind CSS (rem 단위)
```css
.character-hp {
  @apply w-32 h-4 bg-gray-300 rounded-full;
  /* width: 8rem; height: 1rem; */
}

.game-title {
  @apply text-5xl font-bold mb-8;
  /* font-size: 3rem; margin-bottom: 2rem; */
}
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

## 🎮 게임 플로우

1. **게임 시작** → "🎮 게임 시작!" 버튼 클릭
2. **문제 출제** → 한글 단어가 화면 상단에 표시
3. **선택지 제시** → 3개의 영어 단어 버튼 표시
4. **답안 선택** → 버튼 클릭으로 답안 선택
5. **결과 처리** → 정답/오답에 따른 전투 진행
6. **게임 종료** → 승리 또는 패배 시 모달 표시

## 🚀 향후 개선 계획

- [ ] **단어 데이터베이스 확장**: 100+ 단어 추가
- [ ] **난이도 시스템**: 레벨별 단어 난이도 조절  
- [ ] **멀티플레이어**: 실시간 대전 기능
- [ ] **성취 시스템**: 배지, 업적 기능
- [ ] **사운드 이펙트**: 공격, 효과음 추가
- [ ] **캐릭터 다양화**: 다양한 캐릭터 선택
- [ ] **스킬 시스템**: 특수 공격 기능

## 🎯 교육적 효과

### 💡 학습자에게
- **게임화 학습**: 재미있는 방식으로 영어 단어 학습
- **즉시 피드백**: 실시간 정답/오답 확인
- **반복 학습**: 게임 재시작을 통한 자연스러운 복습

### 👩‍💻 개발자에게
- **Vue.js 생태계**: Nuxt.js, Pinia 실무 경험
- **상태 관리**: 복잡한 게임 상태 관리 패턴 학습
- **컴포넌트 설계**: 재사용 가능한 컴포넌트 아키텍처
- **애니메이션**: CSS 트랜지션/애니메이션 구현

## 📱 반응형 디자인

- **모바일 우선**: 터치 인터페이스 최적화
- **태블릿 지원**: 중간 화면 크기 대응
- **데스크톱**: 대화면에서의 최적 레이아웃

## 🔗 참고 링크

- [Nuxt.js 공식 문서](https://nuxt.com/)
- [Pinia 공식 문서](https://pinia.vuejs.org/)  
- [Vue.js 3 공식 문서](https://vuejs.org/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/)
- [다키스트 던전 (게임 영감)](https://www.darkestdungeon.com/)

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 👨‍💻 개발자

**bedcoding** - [GitHub](https://github.com/bedcoding)

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!  
🎮 게임을 플레이하고 피드백을 남겨주세요!

💼 **채용 담당자님께**: 이 프로젝트는 Vue.js/Nuxt.js 실무 역량과 창의적 문제 해결 능력을 보여주는 포트폴리오입니다.
