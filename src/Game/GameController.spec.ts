import { GameController } from "./GameController";
import { EndedState } from "./EndedState";
import { RunningState } from "./RunningState";
import { SetupState } from "./Setup";

describe("GameController", () => {
  it("can setup and start a game", () => {
    const controller = new GameController();

    //#region Setup
    expect(controller.state).toBeInstanceOf(SetupState);

    const setup = controller.state as SetupState;
    expect(setup.canStartGame).toBe(false);
    expect(setup.canAddPlayer()).toBe(true);

    // add first player
    setup.addPlayer({ name: "Jess" });
    // ...but that's not enough
    expect(setup.canStartGame).toBe(false);

    // add second player
    setup.addPlayer({ name: "Leah" });
    // ...and now we can begin
    expect(setup.canStartGame).toBe(true);
    //#endregion Setup

    setup.triggerSetupComplete();

    //#region Running
    expect(controller.state).toBeInstanceOf(RunningState);

    const gameInstance = controller.state as RunningState;
    expect(gameInstance.players).toHaveLength(setup.players.length);
    expect(gameInstance.currentPlayer).not.toBeNull();

    // TODO: Gameplay goes here
    // HACK: just set the winning condition manually for now
    const winner = gameInstance.currentPlayer;
    winner.prestigePoints = 15;

    expect(gameInstance.getWinner()).toBe(winner);
    expect(gameInstance.canEndGame).toBe(true);

    //#endregion Running

    gameInstance.triggerWinningCondition();

    //#region Endgame
    expect(controller.state).toBeInstanceOf(EndedState);

    const endGame = controller.state as EndedState;
    expect(endGame.winner.name).toBe(winner.name);
    expect(endGame.rankings[0].name).toBe(winner.name);

    //#endregion Endgame

    // Do it all over again
    endGame.triggerReplay();

    expect(controller.state).toBeInstanceOf(SetupState);
  });
});
