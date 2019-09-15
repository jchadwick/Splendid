import { IGameState } from "../../StateContracts";
import { RunningState } from "../../ActiveGame/RunningState";
import { GameController } from "../../GameController";

export class ConsoleGameUI extends GameController {
  constructor() {
    super();
  }

  printGameState(gameState: IGameState) {
    const currentStateName = typeof gameState;

    switch (currentStateName) {
      case RunningState.name:
        printActiveGameState(gameState as RunningState);
        break;

      default:
        console.log(`*** ${currentStateName} ***`, `\n`);
        console.log(JSON.stringify(gameState), `\n`);
        break;
    }
  }
}

const printActiveGameState = (gameState: RunningState) => {
  console.log(JSON.stringify(gameState), `\n`);
};
