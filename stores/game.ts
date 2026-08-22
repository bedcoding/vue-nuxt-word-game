import { defineStore } from 'pinia'
import { regionsDatabase } from '@/data/regions/index'
import { GAME_CONFIG } from '@/constants/game.config'
import { pickOne, randomInt, shuffle } from '@/utils/random'
import { createStreamLineReader, parseSseDataLine } from '@/utils/sse'
import type {
  AIStoryData,
  AnswerOutcome,
  GameStage,
  GameState,
  RoundResult
} from '@/types/game'

/**
 * 진행 중인 스토리 요청 추적용.
 *
 * state에 두지 않는 이유: AbortController는 직렬화할 수 없어서 SSR 페이로드에
 * 실을 수 없다. generateStory는 브라우저에서만 실행되므로(아래 import.meta.server
 * 가드) 모듈 스코프에 둬도 서버에서 요청 간에 섞이지 않는다.
 */
let storyAbort: AbortController | null = null
let storyRequestId = 0

/** 지역 데이터는 불변이라 state가 아니라 모듈에서 직접 읽는다 (SSR 페이로드도 줄어든다) */
function findStage(regionId: number | null, stageNumber: number): GameStage | null {
  const region = regionsDatabase.find(item => item.id === regionId)
  return region?.stages.find(item => item.stage === stageNumber) ?? null
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    // 게임 진행 상태
    gamePhase: 'menu',
    selectedRegion: null,
    currentStageNumber: 1,

    // 플레이어 / 적
    player: {
      name: GAME_CONFIG.player.name,
      hp: GAME_CONFIG.player.maxHp,
      maxHp: GAME_CONFIG.player.maxHp
    },
    enemy: { name: '슬라임', hp: 80, maxHp: 80 },

    // 전투 상태
    isGameOver: false,
    isPlayerTurn: true,
    score: 0,

    // 현재 문제
    currentQuestion: null,
    currentChoices: [],
    currentWords: [],

    // AI 스토리
    aiGeneratedStory: null,
    storyState: 'idle'
  }),

  getters: {
    playerHpPercentage: state => (state.player.hp / state.player.maxHp) * 100,
    enemyHpPercentage: state => (state.enemy.hp / state.enemy.maxHp) * 100,
    isPlayerWin: state => state.enemy.hp <= 0,

    availableRegions: () => regionsDatabase,
    currentRegion: state => regionsDatabase.find(item => item.id === state.selectedRegion),
    currentStage: (state): GameStage | null =>
      findStage(state.selectedRegion, state.currentStageNumber),

    isBossStage: state => state.currentStageNumber === GAME_CONFIG.totalStages,
    progressPercentage: state => (state.currentStageNumber / GAME_CONFIG.totalStages) * 100,
    /** 화면에 표시하는 레벨 = 진행한 스테이지 */
    level: state => state.currentStageNumber,

    /** AI 스토리가 있으면 그것, 없으면 지역 데이터의 하드코딩 스토리 */
    currentStoryData: (state): AIStoryData | null => {
      if (state.aiGeneratedStory) return state.aiGeneratedStory
      // 생성 중이고 아직 받은 조각이 없으면 로딩 화면을 보여준다
      if (state.storyState === 'generating') return null

      const stage = findStage(state.selectedRegion, state.currentStageNumber)
      return stage ? { storyTitle: stage.storyTitle, content: stage.content } : null
    }
  },

  actions: {
    // ── 진행 흐름 ─────────────────────────────────────────────────────────
    // 이 액션들은 상태만 바꾸고, 이동할 경로를 문자열로 돌려준다.
    // 실제 라우팅은 화면(composables/useGameFlow)에서 한다.
    // 스토어가 navigateTo를 직접 부르면 도메인 로직이 화면 구조에 묶여서
    // 테스트가 어려워지고 SSR에서 예상치 못한 리다이렉트가 발생한다.

    /** 지역을 골라 새 모험을 시작한다 */
    startRegion(regionId: number): string {
      this.selectedRegion = regionId
      this.currentStageNumber = 1
      this.score = 0
      this.player.hp = this.player.maxHp
      this.resetStory()
      this.gamePhase = 'story'
      this.loadCurrentStage()
      void this.generateStory()
      return '/story'
    },

    /** 전투 시작 */
    startBattle(): string {
      // 이미 끝난 전투로 다시 들어오는 경우(적을 쓰러뜨린 뒤 스토리로 되돌아왔을 때 등)
      // 적을 원래 상태로 되살린다. 이 보정이 없으면 첫 답을 내는 순간
      // enemy.hp가 이미 0이라 곧바로 "클리어" 판정이 나버린다.
      if (this.isGameOver || this.enemy.hp <= 0) {
        this.loadCurrentStage()
      }

      this.gamePhase = 'battle'
      this.isGameOver = false
      this.nextQuestion()
      return '/battle'
    },

    /** 스테이지 클리어 후 다음 단계로. 마지막 스테이지였다면 승리 화면으로 */
    advanceStage(): string {
      if (this.currentStageNumber >= GAME_CONFIG.totalStages) {
        this.gamePhase = 'victory'
        return '/victory'
      }

      this.currentStageNumber += 1
      this.gamePhase = 'story'
      this.resetStory()
      this.loadCurrentStage({ heal: true })
      void this.generateStory()
      return '/story'
    },

    /** 같은 스테이지 재도전. 체력을 회복시켜 준다 */
    retryCurrentStage(): string {
      this.player.hp = this.player.maxHp
      this.gamePhase = 'story'
      this.loadCurrentStage()
      return '/story'
    },

    /** 메인 메뉴로 (진행 상황 초기화) */
    goToMenu(): string {
      this.abortStoryGeneration()
      this.$reset()
      return '/'
    },

    /** 스테이지 데이터(단어/적)를 상태에 반영한다 */
    loadCurrentStage(options: { heal?: boolean } = {}): void {
      const stage = this.currentStage
      if (!stage) return

      this.currentWords = [...stage.words]
      this.enemy = { ...stage.enemy }
      this.isGameOver = false
      this.isPlayerTurn = true
      this.currentQuestion = null
      this.currentChoices = []

      if (options.heal && !this.isBossStage) {
        this.player.hp = Math.min(
          this.player.maxHp,
          this.player.hp + GAME_CONFIG.healPerStage
        )
      }
    },

    // ── 화면 진입 보정 (idempotent) ────────────────────────────────────────
    // URL로 직접 들어와도 화면이 성립하도록 최소한만 채운다.
    // 여러 번 호출해도 같은 결과가 나오므로 SSR/하이드레이션에서 안전하다.

    ensureRunReady(): void {
      if (!this.selectedRegion) this.selectedRegion = 1
      if (this.currentStageNumber < 1) this.currentStageNumber = 1
      if (this.currentWords.length === 0) this.loadCurrentStage()
    },

    ensureStoryReady(): void {
      this.ensureRunReady()
      this.gamePhase = 'story'
    },

    ensureBattleReady(): void {
      this.ensureRunReady()
      // 끝난 전투 상태로 /battle에 진입하면 적을 되살린다 (startBattle과 같은 이유)
      if (this.isGameOver || this.enemy.hp <= 0) this.loadCurrentStage()
      if (!this.currentQuestion) this.nextQuestion()
      this.gamePhase = 'battle'
    },

    ensureVictoryReady(): void {
      this.ensureRunReady()
      if (this.currentStageNumber < GAME_CONFIG.totalStages) {
        this.currentStageNumber = GAME_CONFIG.totalStages
      }
      if (this.player.hp <= 0) this.player.hp = 1
      // isPlayerWin이 true여야 승리 화면의 버튼이 맞게 나온다.
      // ensureRunReady가 적 체력을 되살릴 수 있으므로 반드시 그 뒤에 둔다.
      this.enemy.hp = 0
      this.isGameOver = true
      this.gamePhase = 'victory'
    },

    ensureDefeatReady(): void {
      this.ensureRunReady()
      this.player.hp = 0
      this.isGameOver = true
      this.gamePhase = 'defeat'
    },

    // ── 전투 ──────────────────────────────────────────────────────────────

    /** 새 문제를 뽑고 선택지를 섞어 상태에 저장한다 */
    nextQuestion(): void {
      const question = pickOne(this.currentWords)

      if (!question) {
        this.currentQuestion = null
        this.currentChoices = []
        return
      }

      this.currentQuestion = question
      this.currentChoices = shuffle([question.english, ...question.wrongAnswers])
      this.isPlayerTurn = true
    },

    /**
     * 답 하나를 처리한다. 타이머나 화면 이동은 하지 않고 결과만 돌려준다.
     * 연출 지연과 라우팅은 호출 측(useGameFlow)이 담당한다.
     */
    submitAnswer(choice: string): AnswerOutcome {
      const question = this.currentQuestion

      if (this.isGameOver || !this.isPlayerTurn || !question) {
        return {
          accepted: false,
          correct: false,
          correctAnswer: question?.english ?? '',
          damage: 0,
          result: 'continue'
        }
      }

      const correct = choice === question.english
      this.isPlayerTurn = false

      let damage: number
      if (correct) {
        const range = GAME_CONFIG.damage.playerAttack
        damage = randomInt(range.min, range.max)
        this.enemy.hp = Math.max(0, this.enemy.hp - damage)
        this.score += GAME_CONFIG.score.correctAnswer
      } else {
        const range = GAME_CONFIG.damage.enemyAttack
        damage = randomInt(range.min, range.max)
        this.player.hp = Math.max(0, this.player.hp - damage)
      }

      return {
        accepted: true,
        correct,
        correctAnswer: question.english,
        damage,
        result: this.resolveRound()
      }
    },

    /** 라운드 종료 판정. 점수 정산은 여기서 한 번만 일어난다 */
    resolveRound(): RoundResult {
      if (this.player.hp <= 0) {
        this.isGameOver = true
        this.gamePhase = 'defeat'
        return 'defeated'
      }

      if (this.enemy.hp <= 0) {
        this.isGameOver = true
        this.score += GAME_CONFIG.score.stageClear

        if (this.isBossStage) {
          this.score += GAME_CONFIG.score.bossClear
          this.gamePhase = 'victory'
          return 'regionCleared'
        }

        return 'stageCleared'
      }

      return 'continue'
    },

    // ── AI 스토리 ─────────────────────────────────────────────────────────

    /** 스테이지가 바뀔 때: 진행 중 요청을 취소하고 스토리를 비운다 */
    resetStory(): void {
      storyAbort?.abort()
      storyAbort = null
      storyRequestId += 1
      this.aiGeneratedStory = null
      this.storyState = 'idle'
    },

    /** 화면을 떠날 때: 요청만 끊고, 이미 받은 스토리는 남겨둔다 */
    abortStoryGeneration(): void {
      storyAbort?.abort()
      storyAbort = null
      storyRequestId += 1

      if (this.storyState === 'generating') {
        this.storyState = this.aiGeneratedStory?.content ? 'success' : 'failed'
      }
    },

    /**
     * AI 스토리를 스트리밍으로 받아온다.
     *
     * - AbortController: 이전 요청을 취소해 쓸데없는 토큰 소비를 막는다.
     * - requestId: abort가 늦게 반영돼 응답이 도착해도 상태를 덮어쓰지 않게 한다.
     * - 실패해도 throw하지 않는다. currentStoryData가 하드코딩 스토리로 폴백한다.
     */
    async generateStory(): Promise<void> {
      // 서버 렌더링 중에는 호출하지 않는다.
      // SSR은 하드코딩 스토리로 그리고, AI 생성은 브라우저에서 이어받는다.
      if (import.meta.server || !this.selectedRegion) return

      storyAbort?.abort()
      const controller = new AbortController()
      const requestId = ++storyRequestId
      storyAbort = controller

      const isStale = (): boolean => requestId !== storyRequestId

      this.storyState = 'generating'
      this.aiGeneratedStory = null

      let title = ''
      let content = ''

      const applyEvent = (line: string): void => {
        const raw = parseSseDataLine(line)
        if (!raw) return

        let payload: { type?: string; title?: string; content?: string; error?: string }
        try {
          payload = JSON.parse(raw)
        } catch {
          return
        }

        switch (payload.type) {
          case 'title':
            title = payload.title ?? ''
            break
          case 'content':
            content += payload.content ?? ''
            break
          case 'complete':
            title = payload.title || title
            content = payload.content || content
            break
          case 'error':
            throw new Error(payload.error ?? 'STORY_FAILED')
          default:
            return
        }

        this.aiGeneratedStory = {
          storyTitle: title || `${this.currentStageNumber}단계`,
          content
        }
      }

      try {
        const response = await fetch('/api/generate-story-stream', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stageNumber: this.currentStageNumber,
            regionId: this.selectedRegion
          }),
          signal: controller.signal
        })

        if (!response.ok || !response.body) {
          throw new Error(`스토리 API 오류: ${response.status}`)
        }

        const reader = response.body.getReader()
        const lineReader = createStreamLineReader()

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            // 이미 다음 요청이 시작됐다면 이 응답은 버린다
            if (isStale()) return
            for (const line of lineReader.push(value)) applyEvent(line)
          }
          for (const line of lineReader.flush()) applyEvent(line)
        } finally {
          reader.releaseLock()
        }

        if (isStale()) return

        if (content) {
          this.storyState = 'success'
        } else {
          this.storyState = 'failed'
          this.aiGeneratedStory = null
        }
      } catch (error) {
        // 취소된 요청이거나 이미 낡은 요청이면 조용히 끝낸다
        if (isStale() || controller.signal.aborted) return

        console.warn('[story] AI 스토리 생성 실패, 기본 스토리로 진행합니다:', error)
        this.storyState = 'failed'
        this.aiGeneratedStory = null
      } finally {
        if (storyAbort === controller) storyAbort = null
      }
    }
  }
})
