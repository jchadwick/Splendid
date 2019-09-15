import {
  RunningStateSimulation,
  RunningState
} from "../ActiveGame/RunningState";
import { PlayerActionCommand } from "../ActiveGame/actions/PlayerAction";
import { simulateActionScenario } from "./simulateActionScenario";
import { calculateScenarioScore } from "./calculateScenarioScore";

interface SimulatedActionScenarioResult {
  action: PlayerActionCommand;
  result: RunningStateSimulation;
  score: number;
}

export const selectAIPlayerAction = async (
  gameState: RunningState
): Promise<PlayerActionCommand> => {
  const actions = gameState.availableActions();

  const simulations = await Promise.all(
    actions.map(
      action =>
        new Promise<SimulatedActionScenarioResult>(done => {
          const result = simulateActionScenario(
            RunningState.simulate(gameState),
            action
          );
          done({ action, result, score: calculateScenarioScore(result) });
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
