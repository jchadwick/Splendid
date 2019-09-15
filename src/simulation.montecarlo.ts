import { MonteCarlo, cloneGameState, simulateActionScenario } from "./ai";
import { generateRunningGameState } from "./mockData";
import { RunningStateSimulation } from "./ActiveGame/RunningState";
import { PlayerActionCommand } from "./ActiveGame/actions/PlayerAction";
import { getAvailableActions } from "./util";

(async function simulation() {
  const state = cloneGameState(await generateRunningGameState());

  const mcts = new MonteCarlo<RunningStateSimulation, PlayerActionCommand>({
    legalPlays: (state: RunningStateSimulation) => getAvailableActions(state),
    nextState: simulateActionScenario,
    winner: (state: RunningStateSimulation) =>
      state == null ? 0 : state.winner && state.winner.name
  });

  console.log("Running simulations...");
  mcts.runSearch(state, 1);
  const stats = mcts.getStats(state);
  console.log(`Stats: ${JSON.stringify(stats)}`);
  let play = mcts.bestPlay(state, "robust");
  console.log(`Next Move: ${JSON.stringify(play)}`);
})();
