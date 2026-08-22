import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GAME_CONFIG } from '@/constants/game.config'
import { useGameStore } from '@/stores/game'

/**
 * 스토어가 navigateTo를 직접 부르지 않기 때문에 라우터/Nuxt 런타임 없이
 * 이 테스트가 성립한다. 액션은 "이동할 경로"를 값으로 돌려줄 뿐이다.
 */

/** 적을 확실히 쓰러뜨린다 (한 방에 죽지 않는 스테이지도 있으므로 반복) */
function defeatEnemy(store: ReturnType<typeof useGameStore>): void {
  for (let i = 0; i < 20; i++) {
    if (store.enemy.hp <= 0) return
    if (store.isGameOver) return
    store.isPlayerTurn = true
    const answer = store.currentQuestion?.english
    if (!answer) throw new Error('문제가 없습니다')
    const outcome = store.submitAnswer(answer)
    if (outcome.result !== 'continue') return
    store.nextQuestion()
  }
  throw new Error('적을 쓰러뜨리지 못했습니다')
}

/** SSE 프레임 배열을 fetch 응답처럼 감싼다 */
function sseResponse(frames: string[]): Response {
  const encoder = new TextEncoder()
  let index = 0

  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (index >= frames.length) {
        controller.close()
        return
      }
      controller.enqueue(encoder.encode(frames[index++]!))
    }
  })

  return { ok: true, status: 200, body } as unknown as Response
}

const frame = (payload: unknown): string => `data: ${JSON.stringify(payload)}\n\n`

describe('useGameStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // 테스트가 실제 네트워크를 건드리지 않게 기본값은 항상 실패로 둔다.
    // (startRegion / advanceStage가 스토리 생성을 비동기로 띄운다)
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 503, body: null })))
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  describe('startRegion', () => {
    it('이동할 경로를 돌려주고 진행 상태를 초기화한다', () => {
      const store = useGameStore()
      store.score = 999
      store.player.hp = 3

      const path = store.startRegion(1)

      expect(path).toBe('/story')
      expect(store.selectedRegion).toBe(1)
      expect(store.currentStageNumber).toBe(1)
      expect(store.score).toBe(0)
      expect(store.player.hp).toBe(GAME_CONFIG.player.maxHp)
      expect(store.gamePhase).toBe('story')
      expect(store.currentWords.length).toBeGreaterThan(0)
    })
  })

  describe('nextQuestion', () => {
    it('선택지를 상태에 저장하고, 정답이 항상 포함된다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.nextQuestion()

      const question = store.currentQuestion
      expect(question).not.toBeNull()
      expect(store.currentChoices).toContain(question!.english)
      expect(store.currentChoices).toHaveLength(1 + question!.wrongAnswers.length)
    })

    it('상태로 들고 있으니 여러 번 읽어도 순서가 바뀌지 않는다', () => {
      // getter에서 매번 셔플하던 기존 구현의 회귀 방지.
      // 순서가 흔들리면 SSR HTML과 클라이언트 렌더가 달라져 하이드레이션이 깨진다.
      const store = useGameStore()
      store.startRegion(1)
      store.nextQuestion()

      const first = [...store.currentChoices]
      for (let i = 0; i < 50; i++) {
        expect(store.currentChoices).toEqual(first)
      }
    })
  })

  describe('submitAnswer', () => {
    it('정답이면 적 체력이 줄고 점수가 오른다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.nextQuestion()

      const enemyHpBefore = store.enemy.hp
      const outcome = store.submitAnswer(store.currentQuestion!.english)

      expect(outcome.accepted).toBe(true)
      expect(outcome.correct).toBe(true)
      expect(store.score).toBe(GAME_CONFIG.score.correctAnswer + (outcome.result === 'stageCleared' ? GAME_CONFIG.score.stageClear : 0))
      expect(store.enemy.hp).toBeLessThan(enemyHpBefore)
      expect(outcome.damage).toBeGreaterThanOrEqual(GAME_CONFIG.damage.playerAttack.min)
      expect(outcome.damage).toBeLessThanOrEqual(GAME_CONFIG.damage.playerAttack.max)
    })

    it('오답이면 플레이어 체력이 줄고 정답을 알려준다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.nextQuestion()

      const correct = store.currentQuestion!.english
      const wrong = store.currentQuestion!.wrongAnswers[0]!
      const outcome = store.submitAnswer(wrong)

      expect(outcome.correct).toBe(false)
      expect(outcome.correctAnswer).toBe(correct)
      expect(store.player.hp).toBeLessThan(GAME_CONFIG.player.maxHp)
      expect(store.score).toBe(0)
    })

    it('상대 턴에는 답을 받지 않는다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.nextQuestion()
      store.submitAnswer(store.currentQuestion!.english)

      const hpBefore = store.enemy.hp
      const outcome = store.submitAnswer(store.currentQuestion!.english)

      expect(outcome.accepted).toBe(false)
      expect(store.enemy.hp).toBe(hpBefore)
    })

    it('체력이 0 밑으로 내려가지 않는다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.nextQuestion()
      store.player.hp = 1

      store.submitAnswer(store.currentQuestion!.wrongAnswers[0]!)
      expect(store.player.hp).toBe(0)
    })
  })

  describe('스테이지 클리어 보상', () => {
    it('일반 스테이지는 stageClear 보너스만 준다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.nextQuestion()

      defeatEnemy(store)

      expect(store.isGameOver).toBe(true)
      expect(store.score).toBeGreaterThanOrEqual(GAME_CONFIG.score.stageClear)
      // 보스 보너스는 아직 들어가지 않아야 한다
      expect(store.score).toBeLessThan(
        GAME_CONFIG.score.bossClear + GAME_CONFIG.score.stageClear
      )
    })

    it('보스 스테이지는 bossClear 보너스를 한 번만 더 준다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.currentStageNumber = GAME_CONFIG.totalStages
      store.loadCurrentStage()
      store.nextQuestion()
      store.score = 0

      defeatEnemy(store)

      const answerPoints = store.score
        - GAME_CONFIG.score.stageClear
        - GAME_CONFIG.score.bossClear
      expect(answerPoints % GAME_CONFIG.score.correctAnswer).toBe(0)
      expect(store.gamePhase).toBe('victory')

      // 이미 끝난 전투에 답을 더 넣어도 점수가 또 오르지 않는다
      const settled = store.score
      store.isPlayerTurn = true
      store.submitAnswer(store.currentQuestion!.english)
      expect(store.score).toBe(settled)
    })
  })

  describe('advanceStage', () => {
    it('다음 스테이지로 넘기고 체력을 회복시킨다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.player.hp = 50

      const path = store.advanceStage()

      expect(path).toBe('/story')
      expect(store.currentStageNumber).toBe(2)
      expect(store.player.hp).toBe(50 + GAME_CONFIG.healPerStage)
      expect(store.gamePhase).toBe('story')
    })

    it('회복은 최대 체력을 넘지 않는다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.player.hp = GAME_CONFIG.player.maxHp - 5

      store.advanceStage()
      expect(store.player.hp).toBe(GAME_CONFIG.player.maxHp)
    })

    it('보스 스테이지 진입 시에는 회복시키지 않는다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.currentStageNumber = GAME_CONFIG.totalStages - 1
      store.player.hp = 40

      store.advanceStage()

      expect(store.currentStageNumber).toBe(GAME_CONFIG.totalStages)
      expect(store.player.hp).toBe(40)
    })

    it('마지막 스테이지에서는 승리 화면 경로를 돌려준다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.currentStageNumber = GAME_CONFIG.totalStages

      expect(store.advanceStage()).toBe('/victory')
      expect(store.gamePhase).toBe('victory')
    })
  })

  describe('startBattle', () => {
    it('이미 끝난 전투로 다시 들어오면 적을 되살린다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.nextQuestion()
      defeatEnemy(store)
      expect(store.enemy.hp).toBe(0)

      store.startBattle()

      expect(store.enemy.hp).toBe(store.enemy.maxHp)
      expect(store.isGameOver).toBe(false)
    })

    it('진행 중이던 전투는 그대로 이어간다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.currentStageNumber = 5
      store.loadCurrentStage()
      store.nextQuestion()
      store.submitAnswer(store.currentQuestion!.english)

      const hp = store.enemy.hp
      expect(hp).toBeGreaterThan(0)

      store.startBattle()
      expect(store.enemy.hp).toBe(hp)
    })
  })

  describe('화면 진입 보정은 idempotent하다', () => {
    it('ensureStoryReady를 여러 번 불러도 결과가 같다', () => {
      const store = useGameStore()
      store.ensureStoryReady()
      const snapshot = JSON.stringify(store.$state)

      store.ensureStoryReady()
      store.ensureStoryReady()

      expect(JSON.stringify(store.$state)).toBe(snapshot)
    })

    it('ensureVictoryReady를 여러 번 불러도 점수가 부풀지 않는다', () => {
      const store = useGameStore()
      store.ensureVictoryReady()
      const snapshot = JSON.stringify(store.$state)

      store.ensureVictoryReady()
      store.ensureVictoryReady()

      expect(JSON.stringify(store.$state)).toBe(snapshot)
      expect(store.isPlayerWin).toBe(true)
      expect(store.currentStageNumber).toBe(GAME_CONFIG.totalStages)
    })

    it('ensureBattleReady는 문제와 선택지를 준비한다', () => {
      const store = useGameStore()
      store.ensureBattleReady()

      expect(store.gamePhase).toBe('battle')
      expect(store.currentQuestion).not.toBeNull()
      expect(store.currentChoices.length).toBeGreaterThan(1)
      expect(store.enemy.hp).toBeGreaterThan(0)
    })

    it('ensureDefeatReady는 패배 상태로 맞춘다', () => {
      const store = useGameStore()
      store.ensureDefeatReady()

      expect(store.gamePhase).toBe('defeat')
      expect(store.player.hp).toBe(0)
      expect(store.isGameOver).toBe(true)
    })
  })

  describe('currentStoryData', () => {
    it('AI 스토리가 없으면 지역 데이터의 스토리로 폴백한다', () => {
      const store = useGameStore()
      store.startRegion(1)

      expect(store.storyState).toBe('generating')
      store.storyState = 'failed'

      expect(store.currentStoryData?.content).toBe(store.currentStage?.content)
    })

    it('생성 중이고 받은 조각이 없으면 null (로딩 표시용)', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.storyState = 'generating'
      store.aiGeneratedStory = null

      expect(store.currentStoryData).toBeNull()
    })

    it('AI 스토리가 있으면 그것을 쓴다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.aiGeneratedStory = { storyTitle: '고대 서고', content: '스토리 본문' }
      store.storyState = 'success'

      expect(store.currentStoryData).toEqual({
        storyTitle: '고대 서고',
        content: '스토리 본문'
      })
    })
  })

  describe('retryCurrentStage', () => {
    it('체력을 완전히 회복하고 같은 스테이지를 다시 준다', () => {
      const store = useGameStore()
      store.startRegion(1)
      store.currentStageNumber = 4
      store.loadCurrentStage()
      store.player.hp = 0

      const path = store.retryCurrentStage()

      expect(path).toBe('/story')
      expect(store.currentStageNumber).toBe(4)
      expect(store.player.hp).toBe(GAME_CONFIG.player.maxHp)
    })
  })

  describe('goToMenu', () => {
    it('모든 진행 상황을 초기화한다', () => {
      const store = useGameStore()
      store.startRegion(2)
      store.score = 500
      store.player.hp = 10

      const path = store.goToMenu()

      expect(path).toBe('/')
      expect(store.gamePhase).toBe('menu')
      expect(store.selectedRegion).toBeNull()
      expect(store.score).toBe(0)
      expect(store.player.hp).toBe(GAME_CONFIG.player.maxHp)
      expect(store.aiGeneratedStory).toBeNull()
    })
  })

  describe('generateStory', () => {
    it('지역이 선택되지 않았으면 요청하지 않는다', async () => {
      const store = useGameStore()
      const fetchSpy = vi.fn()
      vi.stubGlobal('fetch', fetchSpy)

      await store.generateStory()
      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('stageNumber와 regionId만 보낸다 (프롬프트 인젝션 경로 차단)', async () => {
      const store = useGameStore()
      store.selectedRegion = 2
      store.currentStageNumber = 3

      const fetchSpy = vi.fn(async () => sseResponse([]))
      vi.stubGlobal('fetch', fetchSpy)

      await store.generateStory()

      const [url, init] = fetchSpy.mock.calls[0] as unknown as [string, RequestInit]
      expect(url).toBe('/api/generate-story-stream')
      expect(JSON.parse(init.body as string)).toEqual({ stageNumber: 3, regionId: 2 })
    })

    it('스트리밍 이벤트를 누적해서 스토리를 만든다', async () => {
      const store = useGameStore()
      store.selectedRegion = 1
      store.currentStageNumber = 1

      vi.stubGlobal('fetch', vi.fn(async () => sseResponse([
        frame({ type: 'title', title: '고대 서고' }),
        frame({ type: 'content', content: '2층에는 ' }),
        frame({ type: 'content', content: '고대의 서고가 있습니다.' }),
        frame({ type: 'complete', title: '고대 서고', content: '2층에는 고대의 서고가 있습니다.' })
      ])))

      await store.generateStory()

      expect(store.storyState).toBe('success')
      expect(store.aiGeneratedStory).toEqual({
        storyTitle: '고대 서고',
        content: '2층에는 고대의 서고가 있습니다.'
      })
    })

    it('프레임이 청크 경계에서 잘려도 정상 처리한다', async () => {
      const store = useGameStore()
      store.selectedRegion = 1

      const whole =
        frame({ type: 'title', title: '어둠의 문' }) +
        frame({ type: 'content', content: '한글이 깨지지 않아야 한다' }) +
        frame({ type: 'complete', title: '어둠의 문', content: '한글이 깨지지 않아야 한다' })

      // 1바이트씩 쪼개서 최악의 경계 조건을 만든다
      // (한글은 UTF-8로 3바이트라 순진하게 디코딩하면 여기서 깨진다)
      const bytes = new TextEncoder().encode(whole)

      vi.stubGlobal('fetch', vi.fn(async () => {
        let cursor = 0
        const body = new ReadableStream<Uint8Array>({
          pull(controller) {
            if (cursor >= bytes.length) {
              controller.close()
              return
            }
            controller.enqueue(Uint8Array.of(bytes[cursor++]!))
          }
        })
        return { ok: true, status: 200, body } as unknown as Response
      }))

      await store.generateStory()

      expect(store.storyState).toBe('success')
      expect(store.aiGeneratedStory?.content).toBe('한글이 깨지지 않아야 한다')
      expect(store.aiGeneratedStory?.content).not.toContain('�')
    })

    it('error 이벤트가 오면 하드코딩 스토리로 폴백한다', async () => {
      const store = useGameStore()
      store.startRegion(1)
      const fallback = store.currentStage?.content

      vi.stubGlobal('fetch', vi.fn(async () => sseResponse([
        frame({ type: 'error', error: 'STORY_UPSTREAM_ERROR' })
      ])))

      await store.generateStory()

      expect(store.storyState).toBe('failed')
      expect(store.aiGeneratedStory).toBeNull()
      expect(store.currentStoryData?.content).toBe(fallback)
    })

    it('늦게 도착한 이전 요청은 새 요청의 결과를 덮어쓰지 않는다', async () => {
      const store = useGameStore()
      store.selectedRegion = 1

      let call = 0
      vi.stubGlobal('fetch', vi.fn(async () => {
        call += 1
        // 1번째(오래된) 요청은 일부러 프레임을 잘게 쪼개 늦게 끝나도록 만든다
        return call === 1
          ? sseResponse([
              frame({ type: 'title', title: '오래된 요청' }),
              frame({ type: 'content', content: '덮어쓰면 안 되는 내용' }),
              frame({ type: 'complete', title: '오래된 요청', content: '덮어쓰면 안 되는 내용' })
            ])
          : sseResponse([
              frame({ type: 'complete', title: '새 요청', content: '이게 남아야 한다' })
            ])
      }))

      const stale = store.generateStory()
      const fresh = store.generateStory()
      await Promise.all([stale, fresh])

      expect(store.aiGeneratedStory?.storyTitle).toBe('새 요청')
      expect(store.aiGeneratedStory?.content).toBe('이게 남아야 한다')
    })

    it('resetStory는 진행 중인 생성을 무효화한다', async () => {
      const store = useGameStore()
      store.selectedRegion = 1

      vi.stubGlobal('fetch', vi.fn(async () => {
        // 응답이 시작되기 전에 resetStory가 끼어드는 상황을 만든다
        store.resetStory()
        return sseResponse([
          frame({ type: 'complete', title: '버려질 스토리', content: '버려질 내용' })
        ])
      }))

      await store.generateStory()

      expect(store.aiGeneratedStory).toBeNull()
      expect(store.storyState).toBe('idle')
    })
  })
})
