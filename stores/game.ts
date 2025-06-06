import { defineStore } from 'pinia'
import { regionsDatabase } from '@/data/regions/index'
import type { GameState, GamePhase, Word, GameRegion, Player, Enemy, AIStoryData } from '@/types/game'

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
    currentWords: [] as Word[],

    // AI 스토리 생성 관련
    isLoadingStory: false,
    aiGeneratedStory: null as AIStoryData | null,
    storyLoadingProgress: 0,
    // AI 스토리 생성 상태 추적
    aiStoryState: 'idle' as 'idle' | 'generating' | 'success' | 'failed'
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
    progressPercentage: (state) => (state.currentStageNumber / 10) * 100,
    
    // AI 생성 스토리 또는 하드코딩된 스토리 반환
    currentStoryData: (state) => {
      // AI 스토리가 성공적으로 생성되었거나 생성 중이면 AI 스토리 사용
      if ((state.aiStoryState === 'success' || state.aiStoryState === 'generating') && state.aiGeneratedStory) {
        return state.aiGeneratedStory
      }
      
      // AI 스토리 생성 중이지만 아직 데이터가 없다면 null 반환 (로딩 메시지 표시)
      if (state.aiStoryState === 'generating' && !state.aiGeneratedStory) {
        return null
      }
      
      // AI 스토리 생성이 실패했거나 idle 상태라면 하드코딩된 스토리 사용
      if (state.aiStoryState === 'failed' || state.aiStoryState === 'idle') {
        const region = state.regionsDatabase.find(r => r.id === state.selectedRegion)
        const stage = region ? region.stages.find(s => s.stage === state.currentStageNumber) : null
        
        return stage ? {
          storyTitle: stage.storyTitle,
          content: stage.content
        } : null
      }
      
      return null
    }
  },
  
  actions: {
    // 게임 페이즈 변경
    setGamePhase(phase: GamePhase) {
      this.gamePhase = phase
    },
    
    // 지역 선택
    async selectRegion(regionId: number) {
      this.selectedRegion = regionId
      this.currentStageNumber = 1
      this.gamePhase = 'story'
      
      // 🔧 AI 스토리 생성 시도 (성공/실패와 상관없이 다른 데이터는 로드)
      try {
        await this.generateAIStory()
      } catch (error) {
        // AI 생성 실패 시에만 하드코딩 스토리 사용
        console.log('🔄 AI 스토리 생성 실패, 하드코딩 스토리 사용')
      }
      
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
    
    // AI 스토리 생성 (스트리밍 방식)
    async generateAIStory() {
      try {
        // 🔧 생성 상태로 변경 (빈 화면 표시)
        this.aiStoryState = 'generating'
        this.aiGeneratedStory = null

        // 이전 맥락 생성
        const previousContext = this.getPreviousStoryContext()
        console.log('📝 이전 맥락:', previousContext)

        // 🔧 현재 단계의 실제 적 이름 가져오기
        const currentStage = this.currentStage
        const actualEnemyName = currentStage?.enemy?.name
        
        // fetch를 사용한 스트리밍
        const response = await fetch('/api/generate-story-stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stageNumber: this.currentStageNumber,
            regionId: this.selectedRegion,
            previousContext,
            actualEnemyName // 🔧 실제 게임에서 사용하는 적 이름 전달
          })
        })

        if (!response.ok) {
          throw new Error(`API 오류: ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('스트림 리더를 가져올 수 없습니다')
        }

        let streamingTitle = ''
        let streamingContent = ''

        try {
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              break
            }

            // 청크 디코딩
            const chunk = new TextDecoder().decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                
                if (data.trim() === '') continue

                try {
                  const parsed = JSON.parse(data)

                  switch (parsed.type) {
                    case 'title':
                      streamingTitle = parsed.title
                      break
                      
                    case 'content':
                      streamingContent += parsed.content
                      // 실시간으로 스토리 업데이트
                      this.aiGeneratedStory = {
                        storyTitle: streamingTitle || `${this.currentStageNumber}단계`,
                        content: streamingContent
                      }
                      break
                      
                    case 'complete':
                      this.aiGeneratedStory = {
                        storyTitle: parsed.title || streamingTitle || `${this.currentStageNumber}단계`,
                        content: parsed.content || streamingContent
                      }
                      // 🔧 성공 상태로 변경
                      this.aiStoryState = 'success'
                      return this.aiGeneratedStory
                      
                    case 'error':
                      throw new Error(parsed.error)
                  }
                } catch (parseError) {
                  // JSON 파싱 오류는 무시하고 계속 진행
                }
              }
            }
          }
        } finally {
          reader.releaseLock()
        }

      } catch (error) {
        // 🔧 실패 상태로 변경 (하드코딩 스토리 사용)
        this.aiStoryState = 'failed'
        this.aiGeneratedStory = null
        throw error // 상위에서 catch하도록 에러 전파
      }
    },

    // 이전 스토리 맥락 생성
    getPreviousStoryContext(): string {
      if (this.currentStageNumber <= 1) return '새로운 모험의 시작입니다.'
      
      const region = this.regionsDatabase.find(r => r.id === this.selectedRegion)
      if (!region) return ''

      const previousStage = region.stages.find(s => s.stage === this.currentStageNumber - 1)
      if (!previousStage) return ''

      return `이전 단계에서 ${previousStage.enemy.name} 적을 물리치고 ${previousStage.storyTitle} 스토리를 지나왔습니다.`
    },
    
    // 다음 단계로 진행 (AI 스토리 생성 포함)
    async nextStage() {
      if (this.currentStageNumber < 10) {
        this.currentStageNumber++
        this.gamePhase = 'story'
        
        // 🔧 먼저 새로운 단계 데이터 로드 (적 정보 포함)
        this.loadCurrentStage()
        
        // 🔧 스토리 페이지로 이동
        navigateTo('/story')
        
        // 🔧 AI 스토리 생성 시도 (실패 시 하드코딩 사용)
        try {
          await this.generateAIStory()
        } catch (error) {
          // AI 스토리 생성 실패 시 하드코딩 스토리 사용
        }
      } else {
        // 10단계 완료 시 승리 화면으로
        this.gamePhase = 'result'
        navigateTo('/result')
      }
    },
    
    // 전투 시작
    startBattle() {
      this.gamePhase = 'battle'
      this.isGameOver = false
      this.isPlayerTurn = true
      this.generateNewQuestion()
      
      // 🔧 전투 페이지로 이동
      navigateTo('/battle')
    },
    
    // 메인 메뉴로 돌아가기
    goToMenu() {
      this.gamePhase = 'menu'
      this.selectedRegion = null
      this.currentStageNumber = 1
      this.isGameOver = false
      this.score = 0
      this.player.hp = this.player.maxHp
      this.aiGeneratedStory = null
      this.isLoadingStory = false
      // 🔧 AI 스토리 상태 초기화
      this.aiStoryState = 'idle'
      
      // 🔧 메인 페이지로 이동
      navigateTo('/')
    },
    
    // 스토리로 돌아가기
    goToStory() {
      this.gamePhase = 'story'
      
      // 🔧 스토리 페이지로 이동
      navigateTo('/story')
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
      const damage = Math.floor(Math.random() * 25) + 150 // 15-40 랜덤 데미지
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
        // 🔧 패배 시 결과 페이지로 이동
        setTimeout(() => {
          navigateTo('/result')
        }, 1000)
      } else if (this.enemy.hp <= 0) {
        this.isGameOver = true
        this.score += 50 // 일반 승리 보너스
        
        if (this.currentStageNumber < 10) {
          // 다음 단계로 진행
          setTimeout(() => {
            this.nextStage()
          }, 2000)
        } else {
          // 10단계 완료 시 승리 화면
          this.gamePhase = 'result'
          this.score += 100 // 보스 클리어 보너스
          setTimeout(() => {
            navigateTo('/result')
          }, 2000)
        }
      }
    }
  }
}) 