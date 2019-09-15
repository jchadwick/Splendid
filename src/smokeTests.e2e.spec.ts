import { GameController } from "./GameController";
import { EndedState } from "./EndGame/EndedState";
import { RunningState } from "./ActiveGame/RunningState";
import { SetupState } from "./Setup/SetupState";
import { waitFor } from "./utils";
import gameLog from "./ActiveGame/GameLog";
import { selectAIPlayerAction } from "./ai";

describe("Smoke Tests", () => {
  it("can play an entire game from start to finish", async () => {
    const controller = new GameController();

    //#region Setup
    expect(controller.state).toBeInstanceOf(SetupState);

    const setup = controller.state as SetupState;
    expect(setup.isConfigured).toBe(false);
    expect(setup.canAddPlayer()).toBe(true);

    // add first player
    setup.addPlayer({ name: "RoboCop", isHuman: false });
    expect(setup.players).toHaveLength(1);
    // ...but that's not enough
    expect(setup.isConfigured).toBe(false);

    // add second player
    setup.addPlayer({ name: "Terminator", isHuman: false });
    expect(setup.players).toHaveLength(2);
    // ...and now we can begin
    expect(setup.isConfigured).toBe(true);

    setup.setupComplete();
    //#endregion Setup

    await waitFor(() => controller.state instanceof RunningState);

    //#region Running
    const gameState = controller.state as RunningState;
    expect(gameState.players).toHaveLength(setup.players.length);
    expect(gameState.currentPlayer).not.toBeNull();

    expect(gameState.availableCards).toHaveLength(3);

    for (let row of gameState.availableCards) {
      expect(row.stock.length).toBeGreaterThan(0);
      expect(row.visibleCards).toHaveLength(4);
    }

    Object.keys(gameState.availableTokens).forEach(type => {
      expect(gameState.availableTokens[type]).toBeGreaterThan(4);
    });

    while (!gameState.gameOver) {
      for (let turn = 0; turn < gameState.players.length; turn++) {
        if (gameState.gameOver) {
          continue;
        }

        gameState.beginTurn();

        const action = await selectAIPlayerAction(gameState);

        gameLog.actionTaken(action, gameState);

        action.execute(gameState);

        gameState.endTurn();
      }

      if (gameState.round >= 100) {
        throw new Error("No endgame in sight!");
      }

      gameLog.roundSummary(gameState);
    }

    expect(gameState.winner).toBe(gameState.currentPlayer);
    expect(gameState.gameOver).toBe(true);

    //#endregion Running

    await waitFor(() => controller.state instanceof EndedState);

    //#region Endgame
    const endGame = controller.state as EndedState;
    expect(endGame.winner.name).toBe(gameState.winner.name);
    expect(endGame.rankings[0].name).toBe(gameState.winner.name);
    //#endregion Endgame
  });
});
