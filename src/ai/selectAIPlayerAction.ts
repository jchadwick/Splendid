import { PlayerActionCommand } from "../ActiveGame/actions/PlayerAction";
import {
  cloneGameState,
  simulateActionScenario
} from "./simulateActionScenario";
import { calculateScenarioScore } from "./calculateScenarioScore";
import { getAvailableActions } from "../util";
import { GameState } from "Model";

interface SimulatedActionScenarioResult {
  action: PlayerActionCommand;
  result: GameState;
  score: number;
}

export const selectAIPlayerAction = async (
  gameState: GameState
): Promise<PlayerActionCommand> => {
  const actions = getAvailableActions(gameState);

  const simulations = await Promise.all(
    actions.map(
      action =>
        new Promise<SimulatedActionScenarioResult>(done => {
          const result = simulateActionScenario(
            cloneGameState(gameState),
            action
          );
          done({
            action,
            result,
            score: calculateScenarioScore(result)
          });
        })
    )
  );

  const bestAction = simulations.sort((a, b) => b.score - a.score)[0];

  const {
    __proto__: {
      constructor: { name: actionName }
    }
  } = bestAction.action as any;

  console.debug(
    `Executed ${simulations.length} simulations. Best Scenario: ${actionName} (${bestAction.score})`
  );

  return bestAction.action;
};
