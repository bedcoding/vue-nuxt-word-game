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

export interface GameState {
  gamePhase: GamePhase;
  selectedRegion: number | null;
  currentStageNumber: number;
  player: Player;
  enemy: Enemy;
  isGameOver: boolean;
  isPlayerTurn: boolean;
  score: number;
  level: number;
  currentQuestion: Word | null;
  regionsDatabase: GameRegion[];
  currentWords: Word[];
  // AI 스토리 생성 관련
  isLoadingStory: boolean;
  aiGeneratedStory: AIStoryData | null;
  storyLoadingProgress: number;
  aiStoryState: 'idle' | 'generating' | 'success' | 'failed';
} 