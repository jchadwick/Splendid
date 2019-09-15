import { RunningState } from "./ActiveGame/RunningState";
import { EndedState } from "./EndGame/EndedState";
import {
  IGameState,
  GameSettings,
  GameInstanceSettings,
  GameInstanceResults
} from "./StateContracts";
import { SetupState } from "./Setup/SetupState";

export class GameController {
  state: IGameState;

  constructor() {
    this.setup();
  }

  readonly setup = (config?: GameSettings) => {
    const setupState = new SetupState(config);
    setupState.onNext(() => setupState.buildSettings().then(this.start));
    this.state = setupState;
  };

  readonly start = (config: GameInstanceSettings) => {
    const activeState = new RunningState(config);
    activeState.onNext(() => this.end(activeState.calculateResults()));
    this.state = activeState;
  };

  readonly end = (results: GameInstanceResults) =>
    (this.state = new EndedState(results));
}
