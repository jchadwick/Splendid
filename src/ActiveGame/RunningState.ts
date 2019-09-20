import { GameInstanceSettings, GameStateBase } from "../StateContracts";
import { Player, ResourceCount, DevelopmentCard, GameState } from "../Model";
import {
  createResourceCollection,
  mergeResources,
  clone,
  recalculatePlayerTotals,
  findCurrentPlayer
} from "../utils";
import { shuffle, populateVisibleCards } from "../util";

interface DevelopmentCardRow {
  level: number;
  stock: DevelopmentCard[];
  visibleCards: DevelopmentCard[];
}

export class RunningState extends GameStateBase implements GameState {
  state: GameState & { settings: GameInstanceSettings } = {
    players: [],
    currentPlayerId: null,
    availableCards: [],
    availableTokens: createResourceCollection(),
    settings: null
  };

  get availableCards(): DevelopmentCardRow[] {
    return this.state.availableCards;
  }

  get availableTokens(): ResourceCount {
    return this.state.availableTokens;
  }
  set availableTokens(tokens: ResourceCount) {
    this.state.availableTokens = tokens;
  }

  get currentPlayerId(): string {
    return this.state.currentPlayerId;
  }

  get players(): Player[] {
    return this.state.players;
  }

  readonly hash = (): string => JSON.stringify(this.state);

  constructor(state?: GameState | GameInstanceSettings) {
    super();

    if ("currentPlayerId" in state) {
      this.state = clone(state) as any;
    } else {
      this.initialize(state);
    }
  }

  initialize(settings: GameInstanceSettings) {
    if (!settings) {
      throw new Error("No settings provided");
    }
    if (!settings.developmentCards || !settings.developmentCards.length) {
      throw new Error("No development cards provided");
    }
    if (!settings.playerInfo) {
      throw new Error("No players provided");
    }
    if (!settings.tokens) {
      throw new Error("No tokens provided");
    }

    const players = settings.playerInfo.map(
      ({ name, isHuman }) =>
        ({
          name,
          isHuman,
          patrons: [],
          playedCards: [],
          reservedCards: [],
          tokens: createResourceCollection(),
          prestigePoints: 0,
          totalResources: {
            cards: createResourceCollection(),
            tokens: createResourceCollection()
          }
        } as Player)
    );

    const availableTokens = mergeResources(
      createResourceCollection(),
      settings.tokens
    );

    let deck = clone(settings.developmentCards);

    shuffle(deck);

    const availableCards = [
      {
        level: 1,
        stock: deck.filter(x => x.level === 1),
        visibleCards: []
      },
      {
        level: 2,
        stock: deck.filter(x => x.level === 2),
        visibleCards: []
      },
      {
        level: 3,
        stock: deck.filter(x => x.level === 3),
        visibleCards: []
      }
    ];

    this.state = {
      currentPlayerId: players[0].id,
      players,
      availableCards,
      availableTokens,
      settings
    };

    populateVisibleCards(this.availableCards);
  }

  calculateResults() {
    const rankings = this.players.map(({ name, prestigePoints }) => ({
      name,
      prestigePoints
    }));

    return { rankings };
  }

  readonly isCurrentPlayer = (playerId: string): boolean =>
    findCurrentPlayer(this).id === playerId;
}
