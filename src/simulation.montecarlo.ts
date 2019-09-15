import { MonteCarlo, simulateActionScenario } from "./ai";
import { generateRunningGameState } from "./mockData";
import {
  RunningState,
  RunningStateSimulation
} from "./ActiveGame/RunningState";
import { PlayerActionCommand } from "./ActiveGame/actions/PlayerAction";

(async function simulation() {
  const state = RunningState.simulate(await generateRunningGameState());

  const mcts = new MonteCarlo<RunningStateSimulation, PlayerActionCommand>({
    legalPlays: (state: RunningStateSimulation) => state.availableActions(),
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
