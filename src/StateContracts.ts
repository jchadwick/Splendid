import { ResourceCount, DevelopmentCard } from "./Model";
import EventEmitter from "eventemitter3";

export interface IGameState {
  onNext(listener: EventEmitter.ListenerFn): void;
}

export abstract class GameStateBase implements IGameState {
  protected events = new EventEmitter();

  onNext(listener: EventEmitter.ListenerFn) {
    this.events.on("next", listener);
  }

  protected triggerNext() {
    this.events.emit("next");
  }
}

export interface GameInstanceResults {
  rankings: PlayerRanking[];
}

export interface PlayerRanking {
  name: string;
  prestigePoints: number;
}

export interface GameInstanceSettings {
  developmentCards: DevelopmentCard[];
  visibleCardsPerRow: number;
  winningPoints: number;
  playerInfo: PlayerSettings[];
  tokens: ResourceCount;
}

export interface GameSettings {
  visibleCardsPerRow?: number;
  winningPoints?: number;
  playerInfo?: PlayerSettings[];
  minPlayerCount?: number;
  maxPlayerCount?: number;
  twoPlayerTokenCount?: number;
  threePlayerTokenCount?: number;
  fourPlayerTokenCount?: number;
}

export interface PlayerSettings {
  name: string;
  isHuman?: boolean;
}
