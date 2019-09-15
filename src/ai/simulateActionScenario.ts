import {
  RunningState,
  RunningStateSimulation
} from "../ActiveGame/RunningState";
import { PlayerActionCommand } from "../ActiveGame/actions/PlayerAction";

export const simulateActionScenario = (
  state: RunningStateSimulation,
  action: PlayerActionCommand
): RunningStateSimulation =>
  action == null
    ? null
    : (action
        .execute(RunningState.simulate(state))
        .endTurn() as RunningStateSimulation);
