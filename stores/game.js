import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    // 게임 진행 상태
    gamePhase: 'menu', // 'menu', 'story', 'battle', 'result'
    selectedStory: null,
    
    // 플레이어 상태
    player: {
      hp: 100,
      maxHp: 100,
      name: '용사'
    },
    
    // 적 상태
    enemy: {
      hp: 80,
      maxHp: 80,
      name: '슬라임'
    },
    
    // 게임 상태
    isGameOver: false,
    isPlayerTurn: true,
    score: 0,
    level: 1,
    
    // 현재 문제
    currentQuestion: null,
    
    // 스토리 데이터베이스
    storyDatabase: [
      {
        id: 1,
        title: '마법 도서관',
        description: '잃어버린 영어 단어들을 찾아 떠나는 모험',
        content: `옛날 옛적, 세상의 모든 영어 단어들이 보관된 마법 도서관이 있었습니다.
하지만 어느 날 악마가 나타나 소중한 단어들을 훔쳐갔습니다.

단어들이 사라지자 사람들은 서로 의사소통을 할 수 없게 되었고,
세상은 점점 혼란에 빠져들기 시작했습니다.

당신은 전설의 언어 마법사입니다.
훔쳐간 단어들을 되찾기 위해 모험을 떠나야 합니다.

첫 번째 관문, 마법 도서관의 입구에 작은 정령이 나타났습니다.
이 정령을 물리치고 도서관에 들어가세요!`,
        enemy: { name: '단어 정령', hp: 60, maxHp: 60 },
        words: [
          { korean: '사과', english: 'apple', wrongAnswers: ['banana', 'orange'] },
          { korean: '고양이', english: 'cat', wrongAnswers: ['dog', 'bird'] },
          { korean: '책', english: 'book', wrongAnswers: ['pen', 'paper'] }
        ]
      },
      {
        id: 2,
        title: '시간의 미로',
        description: '시공간이 뒤틀린 미로에서 벌어지는 단어 대결',
        content: `마법 도서관 깊숙한 곳에는 시간의 미로가 있습니다.
이곳에서는 과거, 현재, 미래의 단어들이 뒤섞여 있습니다.

미로를 지키는 시간의 수호자가 당신을 막아섭니다.
"영어 단어의 진정한 의미를 아는 자만이 지나갈 수 있다!"

그는 시간을 조작하여 당신을 혼란스럽게 만들려 합니다.
하지만 올바른 단어를 선택한다면 그의 마법을 깨뜨릴 수 있을 것입니다.

집중하세요. 시간이 흘러도 변하지 않는 것은 언어의 힘입니다!`,
        enemy: { name: '시간 수호자', hp: 80, maxHp: 80 },
        words: [
          { korean: '물', english: 'water', wrongAnswers: ['fire', 'earth'] },
          { korean: '집', english: 'house', wrongAnswers: ['car', 'tree'] },
          { korean: '학교', english: 'school', wrongAnswers: ['hospital', 'market'] }
        ]
      },
      {
        id: 3,
        title: '어둠의 악마',
        description: '모든 단어를 훔쳐간 최종 보스와의 대결',
        content: `드디어 도서관의 최상층에 도달했습니다.
여기에는 모든 단어를 훔쳐간 어둠의 악마가 기다리고 있습니다.

"크크크... 언어 마법사라고? 이제 모든 단어는 내 것이다!"
악마의 주변에는 훔쳐간 단어들이 어둠에 갇혀 떠다니고 있습니다.

이것이 마지막 전투입니다.
당신의 모든 영어 실력을 발휘해서 악마를 물리치고
세상에 단어들을 되돌려주세요!

인류의 소통과 이해가 당신의 손에 달려있습니다!`,
        enemy: { name: '어둠의 악마', hp: 100, maxHp: 100 },
        words: [
          { korean: '친구', english: 'friend', wrongAnswers: ['enemy', 'stranger'] },
          { korean: '음식', english: 'food', wrongAnswers: ['drink', 'clothes'] },
          { korean: '시간', english: 'time', wrongAnswers: ['space', 'money'] },
          { korean: '꽃', english: 'flower', wrongAnswers: ['grass', 'stone'] }
        ]
      }
    ],
    
    // 현재 사용할 단어들
    currentWords: []
  }),
  
  getters: {
    playerHpPercentage: (state) => (state.player.hp / state.player.maxHp) * 100,
    enemyHpPercentage: (state) => (state.enemy.hp / state.enemy.maxHp) * 100,
    isPlayerWin: (state) => state.enemy.hp <= 0,
    isPlayerLose: (state) => state.player.hp <= 0,
    currentChoices: (state) => {
      if (!state.currentQuestion) return []
      
      const choices = [
        state.currentQuestion.english,
        ...state.currentQuestion.wrongAnswers
      ]
      
      // 배열을 랜덤하게 섞기
      return choices.sort(() => Math.random() - 0.5)
    },
    availableStories: (state) => state.storyDatabase,
    currentStory: (state) => {
      return state.storyDatabase.find(story => story.id === state.selectedStory)
    }
  },
  
  actions: {
    // 게임 페이즈 변경
    setGamePhase(phase) {
      this.gamePhase = phase
    },
    
    // 스토리 선택
    selectStory(storyId) {
      this.selectedStory = storyId
      const story = this.storyDatabase.find(s => s.id === storyId)
      if (story) {
        this.currentWords = [...story.words]
        this.enemy = { ...story.enemy }
      }
    },
    
    // 전투 시작
    startBattle() {
      this.gamePhase = 'battle'
      this.player.hp = this.player.maxHp
      this.isGameOver = false
      this.isPlayerTurn = true
      this.score = 0
      this.generateNewQuestion()
    },
    
    // 메인 메뉴로 돌아가기
    goToMenu() {
      this.gamePhase = 'menu'
      this.selectedStory = null
      this.isGameOver = false
      this.score = 0
    },
    
    // 새로운 문제 생성
    generateNewQuestion() {
      if (this.currentWords.length === 0) return
      const randomIndex = Math.floor(Math.random() * this.currentWords.length)
      this.currentQuestion = this.currentWords[randomIndex]
    },
    
    // 답안 선택 처리
    selectAnswer(selectedAnswer) {
      if (!this.isPlayerTurn || this.isGameOver) return
      
      const isCorrect = selectedAnswer === this.currentQuestion.english
      
      if (isCorrect) {
        // 정답: 적 공격
        this.attackEnemy()
        this.score += 10
      } else {
        // 오답: 플레이어가 공격받음
        this.attackPlayer()
      }
      
      // 게임 종료 체크
      this.checkGameOver()
      
      if (!this.isGameOver) {
        // 다음 문제 생성
        setTimeout(() => {
          this.generateNewQuestion()
          this.isPlayerTurn = true
        }, 1500)
      }
    },
    
    // 적 공격
    attackEnemy() {
      const damage = Math.floor(Math.random() * 25) + 15 // 15-40 랜덤 데미지
      this.enemy.hp = Math.max(0, this.enemy.hp - damage)
      this.isPlayerTurn = false
    },
    
    // 플레이어 공격받기
    attackPlayer() {
      const damage = Math.floor(Math.random() * 20) + 10 // 10-30 랜덤 데미지
      this.player.hp = Math.max(0, this.player.hp - damage)
      this.isPlayerTurn = false
    },
    
    // 게임 종료 체크
    checkGameOver() {
      if (this.player.hp <= 0) {
        this.isGameOver = true
        this.gamePhase = 'result'
      } else if (this.enemy.hp <= 0) {
        this.isGameOver = true
        this.gamePhase = 'result'
        this.score += 50 // 승리 보너스
      }
    }
  }
}) 