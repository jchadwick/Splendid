import { RunningState } from "./RunningState";
import { EndedState } from "./EndedState";
import {
  IGameController,
  IGameState,
  GameSettings,
  GameInstanceSettings,
  GameInstanceResults
} from "./Contracts";
import { SetupState } from "./Setup";

export class GameController implements IGameController {
  state: IGameState;

  constructor() {
    this.setup();
  }

  readonly setup = (config?: GameSettings) =>
    (this.state = new SetupState(config, this.start));

  readonly start = (config: GameInstanceSettings) =>
    (this.state = new RunningState(config, this.end));

  readonly end = (results: GameInstanceResults) =>
    (this.state = new EndedState(results, this.setup));
}
