// 게임 관련 타입 정의

export interface Word {
  korean: string;
  english: string;
  wrongAnswers: string[];
}

export interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
}

export interface GameStage {
  stage: number;
  storyTitle: string;
  content: string;
  enemy: Enemy;
  words: Word[];
}

export interface GameRegion {
  id: number;
  title: string;
  description: string;
  stages: GameStage[];
}

export interface Player {
  hp: number;
  maxHp: number;
  name: string;
}

export interface AIStoryData {
  storyTitle: string;
  content: string;
}

export type GamePhase = 'menu' | 'story' | 'battle' | 'victory' | 'defeat';

/** AI 스토리 생성 상태 */
export type StoryState = 'idle' | 'generating' | 'success' | 'failed';

/** 한 라운드(문제 1개)를 처리한 뒤의 게임 상태 */
export type RoundResult =
  /** 전투 계속 */
  | 'continue'
  /** 이 스테이지의 적을 쓰러뜨림 (다음 스테이지 있음) */
  | 'stageCleared'
  /** 보스까지 쓰러뜨려 지역 완주 */
  | 'regionCleared'
  /** 플레이어 사망 */
  | 'defeated';

/** submitAnswer의 결과. 화면 연출과 라우팅에 필요한 정보만 담는다. */
export interface AnswerOutcome {
  /** 답이 실제로 처리됐는지 (상대 턴이거나 전투가 끝났으면 false) */
  accepted: boolean;
  correct: boolean;
  correctAnswer: string;
  /** 이번 라운드에 들어간 데미지 */
  damage: number;
  result: RoundResult;
}

export interface GameState {
  gamePhase: GamePhase;
  selectedRegion: number | null;
  currentStageNumber: number;
  player: Player;
  enemy: Enemy;
  isGameOver: boolean;
  isPlayerTurn: boolean;
  score: number;
  currentQuestion: Word | null;
  /**
   * 셔플이 끝난 선택지. getter가 아니라 상태로 들고 있는다.
   * getter에서 매번 섞으면 SSR HTML과 클라이언트 첫 렌더의 순서가 달라져
   * 하이드레이션 불일치가 발생한다.
   */
  currentChoices: string[];
  currentWords: Word[];
  aiGeneratedStory: AIStoryData | null;
  storyState: StoryState;
}
