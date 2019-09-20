import { GameController } from "./GameController";
import { EndedState } from "./EndGame/EndedState";
import { RunningState } from "./ActiveGame/RunningState";
import { SetupState } from "./Setup/SetupState";
import { waitFor } from "./utils";
import gameLog from "./ActiveGame/GameLog";
import { selectAIPlayerAction } from "./ai";
import { getWinners } from "./util";

const args = process.argv.slice(2);
console.log(JSON.stringify(args));
const playerCount = args.length > 0 ? Number.parseInt(args[0]) : 2;

const playerNames = ["RoboCop", "Terminator", "HAL", "Johnny Five"];

if (isNaN(playerCount) || playerCount < 2 || playerCount > 4) {
  console.error(
    `Player count ${playerCount} is invalid - please select 2-4 players`
  );
}

(async function playGame() {
  const controller = new GameController();

  const setup = controller.state as SetupState;

  for (let i = 0; i < playerCount; i++) {
    setup.addPlayer({ name: playerNames[i], isHuman: false });
  }
  setup.setupComplete();

  await waitFor(() => controller.state instanceof RunningState);

  const gameState = controller.state as RunningState;

  gameState.onNext(() => gameLog.roundSummary(gameState));

  while (getWinners(gameState).length === 0) {
    const action = await selectAIPlayerAction(gameState);

    gameLog.actionTaken(action, gameState);

    action.execute(gameState);

    gameLog.turnSummary(gameState);
  }

  await waitFor(() => controller.state instanceof EndedState);

  const endGame = controller.state as EndedState;
  gameLog.gameSummary(endGame);
})();
