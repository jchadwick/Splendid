import { Player } from "../Model";
import {
  GameInstanceSettings,
  GameInstanceResults as GameResults,
  IGameState
} from "./Contracts";

export class RunningState implements IGameState {
  private _players: Player[];
  private _currentPlayer: Player;

  get canEndGame(): boolean {
    return this.getWinner() != null;
  }

  get currentPlayer(): Player {
    return this._currentPlayer;
  }

  get players(): Player[] {
    return this._players;
  }

  constructor(
    private readonly settings: GameInstanceSettings,
    private readonly onGameWon: (results: GameResults) => void
  ) {
    const players = this.settings.players.map(({ name }) => new Player(name));
    this._players = players;
    this._currentPlayer = players[Math.floor(Math.random() * players.length)];
  }

  triggerWinningCondition() {
    const rankings = this.players.map(({ name, prestigePoints }) => ({
      name,
      prestigePoints
    }));

    this.onGameWon({ rankings });
  }

  readonly getWinner = (): Player | null =>
    this._players.find(x => x.prestigePoints >= this.settings.winningPoints) ||
    null;
}
