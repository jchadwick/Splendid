import { GameState } from "../../../Model";
import { moves } from "./index";

export interface PlayerAction {}

type PlayerActionCommandType = typeof PlayerActionCommand;

export type AvailableMove = { move: keyof typeof moves; args: any[] };

export interface PlayerActionCommandStatic extends PlayerActionCommandType {
  getAvailableMoves(gameState: GameState): AvailableMove[];
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
