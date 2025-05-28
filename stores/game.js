import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
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
    
    // 단어 데이터베이스
    wordDatabase: [
      { korean: '사과', english: 'apple', wrongAnswers: ['banana', 'orange'] },
      { korean: '고양이', english: 'cat', wrongAnswers: ['dog', 'bird'] },
      { korean: '책', english: 'book', wrongAnswers: ['pen', 'paper'] },
      { korean: '물', english: 'water', wrongAnswers: ['fire', 'earth'] },
      { korean: '집', english: 'house', wrongAnswers: ['car', 'tree'] },
      { korean: '학교', english: 'school', wrongAnswers: ['hospital', 'market'] },
      { korean: '친구', english: 'friend', wrongAnswers: ['enemy', 'stranger'] },
      { korean: '음식', english: 'food', wrongAnswers: ['drink', 'clothes'] },
      { korean: '시간', english: 'time', wrongAnswers: ['space', 'money'] },
      { korean: '꽃', english: 'flower', wrongAnswers: ['grass', 'stone'] }
    ]
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
    }
  },
  
  actions: {
    // 게임 시작/리셋
    startNewGame() {
      this.player.hp = this.player.maxHp
      this.enemy.hp = this.enemy.maxHp
      this.isGameOver = false
      this.isPlayerTurn = true
      this.score = 0
      this.level = 1
      this.generateNewQuestion()
    },
    
    // 새로운 문제 생성
    generateNewQuestion() {
      const randomIndex = Math.floor(Math.random() * this.wordDatabase.length)
      this.currentQuestion = this.wordDatabase[randomIndex]
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
      } else if (this.enemy.hp <= 0) {
        this.isGameOver = true
        this.score += 50 // 승리 보너스
      }
    }
  }
}) 