import { GemCount } from "../Model";

export interface IGameController {
  setup(config?: GameSettings): void;
  start(config: GameInstanceSettings): void;
  end(results: GameInstanceResults): void;
}

export interface IGameState {}

export interface GameInstanceResults {
  rankings: PlayerRanking[];
}

export interface PlayerRanking {
  name: string;
  prestigePoints: number;
}

export interface GameInstanceSettings {
  winningPoints: number;
  players: PlayerSettings[];
  tokens: GemCount;
}

export interface GameSettings {
  winningPoints: number;
  players?: PlayerSettings[];
  minPlayerCount: number;
  maxPlayerCount: number;
  twoPlayerTokenCount: number;
  threePlayerTokenCount: number;
  fourPlayerTokenCount: number;
}

export interface PlayerSettings {
  name: string;
}
