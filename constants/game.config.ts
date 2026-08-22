// 게임 밸런스/보상 수치의 단일 진실 원천(Single Source of Truth).
// 매직 넘버를 여기로 모아서 클라이언트·서버가 같은 값을 보게 한다.

export const GAME_CONFIG = {
  /** 지역당 스테이지 수 (마지막 스테이지가 보스전) */
  totalStages: 10,
  /** 선택 가능한 지역 수 */
  totalRegions: 3,

  player: {
    name: '용사',
    maxHp: 100
  },

  /** 스테이지 진입 시 회복량 (보스 스테이지는 제외) */
  healPerStage: 20,

  score: {
    /** 정답 1개 */
    correctAnswer: 10,
    /** 일반 스테이지 클리어 */
    stageClear: 50,
    /** 보스 클리어 추가 보너스 */
    bossClear: 100
  },

  /** 데미지 범위 (양쪽 끝 포함) */
  damage: {
    playerAttack: { min: 15, max: 40 },
    enemyAttack: { min: 10, max: 30 }
  },

  /** 연출용 지연 시간(ms). 스토어가 아니라 화면 흐름에서 사용한다. */
  delays: {
    nextQuestion: 1500,
    stageTransition: 1500,
    defeatTransition: 1000,
    victoryTransition: 2000
  }
} as const

/** AI 스토리 생성 관련 서버 측 설정 */
export const STORY_API_CONFIG = {
  model: 'gpt-4o-mini',
  maxTokens: 300,
  temperature: 0.8,
  /** previousContext 최대 길이 */
  maxContextLength: 1000,
  /** SSE 하트비트 주기(ms) — 프록시가 유휴 연결을 끊는 것을 방지 */
  heartbeatInterval: 15_000,
  /** OpenAI 호출 전체 타임아웃(ms) */
  upstreamTimeout: 30_000
} as const
