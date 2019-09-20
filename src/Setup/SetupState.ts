import {
  GameSettings,
  PlayerSettings,
  GameStateBase,
  GameInstanceSettings
} from "../StateContracts";
import { ResourceCount, NativeResourceTypes } from "../Model";
import { importDeck } from "../util/deckGenerator";

const DefaultGameSettings: GameSettings = Object.freeze({
  maxPlayerCount: 4,
  minPlayerCount: 2,
  twoPlayerTokenCount: 4,
  threePlayerTokenCount: 5,
  fourPlayerTokenCount: 7,
  winningPoints: 15,
  visibleCardsPerRow: 4
});

export class SetupState extends GameStateBase {
  readonly settings: GameSettings;

  players: PlayerSettings[];

  get isConfigured(): boolean {
    return this.players.length >= this.settings.minPlayerCount;
  }

  constructor(settings: GameSettings) {
    super();
    this.settings = Object.assign({}, DefaultGameSettings, settings);
    this.players = (settings && settings.playerInfo) || [];
  }

  addPlayer(player: PlayerSettings) {
    if (!this.canAddPlayer(player)) {
      console.warn("Refusing to add an invalid player");
      return;
    }

    this.players.push(player);
    console.debug(
      `Added player ${player.name}; Total Players: ${this.players.length}`
    );
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

  async buildSettings(): Promise<GameInstanceSettings> {
    const players = this.players;

    const playerCount = players.length;

    const tokens: ResourceCount = {
      Wild: 5,
      ...NativeResourceTypes.reduce((t, gem) => {
        t[gem] = 4 + playerCount;
        return t;
      }, {})
    };

    const developmentCards = importDeck();

    return {
      developmentCards,
      playerInfo: players,
      tokens,
      winningPoints: this.settings.winningPoints,
      visibleCardsPerRow: this.settings.visibleCardsPerRow
    };
  }

  readonly setupComplete = () => {
    if (!this.isConfigured) {
      throw new Error("Game has not been fully configured yet!");
    }

    this.triggerNext();
  };
}
