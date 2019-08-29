import {
  GameSettings,
  PlayerSettings,
  IGameState,
  GameInstanceSettings
} from "./Contracts";
import { GemCount, NaturalGemColors } from "../Model";

const DefaultGameSettings: GameSettings = Object.freeze({
  maxPlayerCount: 4,
  minPlayerCount: 2,
  twoPlayerTokenCount: 4,
  threePlayerTokenCount: 5,
  fourPlayerTokenCount: 7,
  winningPoints: 15
});

export class SetupState implements IGameState {
  players: PlayerSettings[];

  constructor(
    private readonly settings: GameSettings = DefaultGameSettings,
    private readonly onSetupComplete: (settings: GameInstanceSettings) => void
  ) {
    this.players = (settings && settings.players) || [];
  }

  addPlayer(player: PlayerSettings) {
    if (!this.canAddPlayer(player)) {
      console.warn("Refusing to add an invalid player");
      return;
    }

    this.players.push(player);
  }

  canAddPlayer(player?: PlayerSettings): boolean {
    return (
      this.players.length < this.settings.maxPlayerCount &&
      (player == null || player.name != null)
    );
  }

  removePlayer(player: PlayerSettings) {
    this.players.splice(this.players.indexOf(player), 1);
  }

  get canStartGame(): boolean {
    return this.players.length >= this.settings.minPlayerCount;
  }

  triggerSetupComplete() {
    // TODO: validate start game conditions (e.g. have enough players)

    const players = this.players;

    const playerCount = players.length;

    switch (playerCount) {
      case 2:
    }

    const tokens: GemCount = {
      Wild: 5,
      ...Object.keys(NaturalGemColors).reduce((t, gem) => {
        t[gem] = 4 + playerCount;
        return t;
      }, {})
    };

    this.onSetupComplete({
      players,
      tokens,
      winningPoints: this.settings.winningPoints
    });
  }
}
