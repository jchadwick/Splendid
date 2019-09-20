import { MonteCarlo, cloneGameState, simulateActionScenario } from "./ai";
import { generateRunningGameState } from "./mockData";
import { PlayerActionCommand } from "./ActiveGame/actions/PlayerAction";
import { getAvailableActions } from "./util";
import { GameState } from "Model";

(async function simulation() {
  const state = cloneGameState(await generateRunningGameState());

  // const mcts = new MonteCarlo<GameState, PlayerActionCommand>({
  //   legalPlays: (state: GameState) => getAvailableActions(state),
  //   nextState: simulateActionScenario,
  //   winner: (state: GameState) =>
  //     state == null ? 0 : state.winner && state.winner.name
  // });

  // console.log("Running simulations...");
  // mcts.runSearch(state, 1);
  // const stats = mcts.getStats(state);
  // console.log(`Stats: ${JSON.stringify(stats)}`);
  // let play = mcts.bestPlay(state, "robust");
  // console.log(`Next Move: ${JSON.stringify(play)}`);
})();
