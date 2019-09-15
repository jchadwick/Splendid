import {
  RunningState,
  RunningStateSimulation
} from "../ActiveGame/RunningState";
import { PlayerActionCommand } from "../ActiveGame/actions/PlayerAction";
import { clone, recalculatePlayerTotals } from "utils";

export const simulateActionScenario = (
  state: RunningStateSimulation,
  action: PlayerActionCommand
): RunningStateSimulation => {
  if (action == null) {
    return null;
  }

  const simulatedState = action.execute(cloneGameState(state));
  recalculatePlayerTotals(simulatedState);

  return simulatedState as RunningStateSimulation;
};

export const cloneGameState = (
  state: RunningState | RunningStateSimulation
): RunningStateSimulation => {
  const playerId =
    "playerId" in state ? state.playerId : state.currentPlayer.name;

  return Object.assign(new RunningState(clone(state.state)), {
    playerId,
    isPlayer: (id: string) => id === playerId
  });
};
