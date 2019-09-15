import { RunningState } from "../RunningState";

export interface PlayerAction {}

type PlayerActionCommandType = typeof PlayerActionCommand;

export interface PlayerActionCommandStatic extends PlayerActionCommandType {
  getAvailableActions(gameState: RunningState): PlayerActionCommand[];
}

export abstract class PlayerActionCommand<T = any> {
  hash(): string {
    return JSON.stringify({
      name: (this as any).__proto__.constructor.name,
      action: this.action
    });
  }

  constructor(public readonly action: T) {}
  abstract execute(gameState: RunningState): RunningState;
}
