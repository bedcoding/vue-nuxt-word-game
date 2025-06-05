import { defineStore } from 'pinia'
import { regionsDatabase } from '@/data/regions/index'
import type { GameState, GamePhase, Word, GameRegion, Player, Enemy } from '@/types/game'

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    // 게임 진행 상태
    gamePhase: 'menu' as GamePhase,
    selectedRegion: null,
    currentStageNumber: 1,
    
    // 플레이어 상태
    player: {
      hp: 100,
      maxHp: 100,
      name: '용사'
    } as Player,
    
    // 적 상태 (현재 단계의 적)
    enemy: {
      hp: 80,
      maxHp: 80,
      name: '슬라임'
    } as Enemy,
    
    // 게임 상태
    isGameOver: false,
    isPlayerTurn: true,
    score: 0,
    level: 1,
    
    // 현재 문제
    currentQuestion: null as Word | null,
    
    // 지역 데이터베이스 (외부 파일에서 가져옴)
    regionsDatabase: regionsDatabase as GameRegion[],
    
    // 현재 사용할 단어들
    currentWords: [] as Word[]
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
    availableRegions: (state) => state.regionsDatabase,
    currentRegion: (state) => {
      return state.regionsDatabase.find(region => region.id === state.selectedRegion)
    },
    currentStage: (state) => {
      const region = state.regionsDatabase.find(r => r.id === state.selectedRegion)
      return region ? region.stages.find(s => s.stage === state.currentStageNumber) : null
    },
    isBossStage: (state) => state.currentStageNumber === 10,
    progressPercentage: (state) => (state.currentStageNumber / 10) * 100
  },
  
  actions: {
    // 게임 페이즈 변경
    setGamePhase(phase: GamePhase) {
      this.gamePhase = phase
    },
    
    // 지역 선택
    selectRegion(regionId: number) {
      this.selectedRegion = regionId
      this.currentStageNumber = 1
      this.gamePhase = 'story'
      this.loadCurrentStage()
    },
    
    // 현재 단계 로드
    loadCurrentStage() {
      const region = this.regionsDatabase.find(r => r.id === this.selectedRegion)
      if (!region) return
      
      const stage = region.stages.find(s => s.stage === this.currentStageNumber)
      if (!stage) return
      
      this.currentWords = [...stage.words]
      this.enemy = { ...stage.enemy }
      
      // 플레이어 HP 회복 (보스전은 제외)
      if (this.currentStageNumber !== 10) {
        this.player.hp = Math.min(this.player.maxHp, this.player.hp + 20)
      }
    },
    
    // 다음 단계로 진행
    nextStage() {
      if (this.currentStageNumber < 10) {
        this.currentStageNumber++
        this.gamePhase = 'story'
        this.loadCurrentStage()
      } else {
        // 10단계 완료 시 승리 화면으로
        this.gamePhase = 'result'
      }
    },
    
    // 전투 시작
    startBattle() {
      this.gamePhase = 'battle'
      this.isGameOver = false
      this.isPlayerTurn = true
      this.generateNewQuestion()
    },
    
    // 메인 메뉴로 돌아가기
    goToMenu() {
      this.gamePhase = 'menu'
      this.selectedRegion = null
      this.currentStageNumber = 1
      this.isGameOver = false
      this.score = 0
      this.player.hp = this.player.maxHp
    },
    
    // 스토리로 돌아가기
    goToStory() {
      this.gamePhase = 'story'
    },
    
    // 새로운 문제 생성
    generateNewQuestion() {
      if (this.currentWords.length === 0) return
      const randomIndex = Math.floor(Math.random() * this.currentWords.length)
      this.currentQuestion = this.currentWords[randomIndex]
    },
    
    // 답안 선택 처리
    selectAnswer(selectedAnswer: string) {
      if (!this.isPlayerTurn || this.isGameOver) return
      
      const isCorrect = selectedAnswer === this.currentQuestion?.english
      
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
        if (this.currentStageNumber < 10) {
          // 다음 단계로 진행
          setTimeout(() => {
            this.nextStage()
          }, 2000)
        } else {
          // 10단계 완료 시 승리 화면
          this.gamePhase = 'result'
          this.score += 100 // 보스 클리어 보너스
        }
        this.score += 50 // 일반 승리 보너스
      }
    }
  }
}) 