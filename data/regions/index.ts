import type { GameRegion } from '@/types/game'
import { libraryRegion } from './gameLibrary'
import { mazeRegion } from './gameMaze'
import { castleRegion } from './gameCastle'

export const regionsDatabase: GameRegion[] = [
  libraryRegion,
  mazeRegion,
  castleRegion
] 