import { GameState } from "../../../Model";

export interface PlayerAction {}

type PlayerActionCommandType = typeof PlayerActionCommand;

export interface PlayerActionCommandStatic extends PlayerActionCommandType {
  getAvailableActions(gameState: GameState): PlayerActionCommand[];
}

export abstract class PlayerActionCommand<T = any> {
  hash(): string {
    return JSON.stringify({
      name: (this as any).__proto__.constructor.name,
      action: this.action
    });
  }

  constructor(public readonly action: T) {}
  abstract execute(gameState: GameState): GameState;
}
