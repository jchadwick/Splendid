import { IGameController, IGameState } from "./Contracts";

export abstract class GameState implements IGameState {
  constructor(protected readonly game: IGameController) {}
}
