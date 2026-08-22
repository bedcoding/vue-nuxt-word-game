import { onScopeDispose } from 'vue'
import { GAME_CONFIG } from '@/constants/game.config'
import { useGameStore } from '@/stores/game'
import type { AnswerOutcome } from '@/types/game'

/**
 * 게임 진행 흐름(상태 전이 + 화면 이동 + 연출 지연)을 담당한다.
 *
 * 스토어는 "무슨 일이 일어났는지"만 계산하고, 그 결과로 어디로 가고 언제 갈지는
 * 여기서 결정한다. 덕분에 스토어는 라우터 없이도 테스트할 수 있고,
 * 예약된 타이머는 화면이 사라질 때 전부 정리된다.
 */
export function useGameFlow() {
  const store = useGameStore()
  const timers = new Set<ReturnType<typeof setTimeout>>()

  const later = (task: () => void, delay: number): void => {
    const id = setTimeout(() => {
      timers.delete(id)
      task()
    }, delay)
    timers.add(id)
  }

  const clearTimers = (): void => {
    for (const id of timers) clearTimeout(id)
    timers.clear()
  }

  // 컴포넌트가 사라지면 예약된 이동을 모두 취소한다.
  // (살아 있는 setTimeout이 navigateTo를 호출하면 뒤로가기 직후에 엉뚱한
  //  페이지로 튕기는 문제가 생긴다 — 이 프로젝트가 실제로 겪었던 버그다)
  onScopeDispose(clearTimers)

  const go = (path: string) => navigateTo(path)

  return {
    /** 지역 선택 → 스토리 화면 */
    startRegion: (regionId: number) => go(store.startRegion(regionId)),

    /** 스토리 → 전투 */
    startBattle: () => go(store.startBattle()),

    /** 전투 → 스토리 (뒤로가기) */
    backToStory: () => {
      store.ensureStoryReady()
      return go('/story')
    },

    /** 다음 스테이지로 */
    continueAdventure: () => go(store.advanceStage()),

    /** 같은 스테이지 재도전 */
    retryStage: () => go(store.retryCurrentStage()),

    /** 메인 메뉴로 (진행 상황 초기화) */
    goToMenu: () => go(store.goToMenu()),

    /** 진행 중인 AI 스토리 요청만 끊는다 */
    abortStory: () => store.abortStoryGeneration(),

    /**
     * 답 하나를 제출한다. 상태 갱신은 즉시, 다음 문제/화면 이동은 연출 지연 후.
     * 반환값으로 전투 로그를 찍을 수 있다.
     */
    answer: (choice: string): AnswerOutcome => {
      const outcome = store.submitAnswer(choice)
      if (!outcome.accepted) return outcome

      switch (outcome.result) {
        case 'continue':
          later(() => store.nextQuestion(), GAME_CONFIG.delays.nextQuestion)
          break
        case 'stageCleared':
          later(() => go(store.advanceStage()), GAME_CONFIG.delays.stageTransition)
          break
        case 'regionCleared':
          later(() => go('/victory'), GAME_CONFIG.delays.victoryTransition)
          break
        case 'defeated':
          later(() => go('/defeat'), GAME_CONFIG.delays.defeatTransition)
          break
      }

      return outcome
    }
  }
}
