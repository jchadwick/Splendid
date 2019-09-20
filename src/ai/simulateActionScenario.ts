import { RunningState } from "../ActiveGame/RunningState";
import { PlayerActionCommand } from "../ActiveGame/actions/PlayerAction";
import { recalculatePlayerTotals } from "utils";
import { GameState } from "Model";

export const simulateActionScenario = (
  state: GameState,
  action: PlayerActionCommand
): GameState => {
  if (action == null) {
    return null;
  }

  const simulatedState = action.execute(cloneGameState(state));
  recalculatePlayerTotals(simulatedState);

  return simulatedState;
};

export const cloneGameState = (state: GameState): GameState =>
  new RunningState(state);
