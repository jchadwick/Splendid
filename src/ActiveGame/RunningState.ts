import { GameInstanceSettings, GameState } from "../StateContracts";
import {
  Player,
  ResourceCount,
  DevelopmentCard,
  GameState as GameStateContract
} from "../Model";
import {
  createResourceCollection,
  mergeResources,
  clone,
  recalculatePlayerTotals
} from "../utils";
import { shuffle } from "../util";
import { PlayerActionCommand } from "./actions/PlayerAction";
import { Commands } from "./actions";

interface DevelopmentCardRow {
  level: number;
  stock: DevelopmentCard[];
  visibleCards: DevelopmentCard[];
}

interface RunningStateState {
  players: Player[];
  currentPlayer: Player;
  winner?: Player;
  availableCards: DevelopmentCardRow[];
  availableTokens: ResourceCount;
  round: number;
  settings: GameInstanceSettings;
}

export interface RunningStateSimulation extends RunningState {
  playerId: string;
  isPlayer(id: string): boolean;
}

export class RunningState extends GameState implements GameStateContract {
  state: RunningStateState = {
    players: null,
    currentPlayer: null,
    winner: null,
    availableCards: [],
    availableTokens: createResourceCollection(),
    round: 0,
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

  get gameOver(): boolean {
    return this.winner != null;
  }

  get currentPlayer(): Player {
    return this.state.currentPlayer;
  }

  get players(): Player[] {
    return this.state.players;
  }

  get round(): number {
    return this.state.round;
  }

  get winner(): Player | null {
    return this.state.winner;
  }

  hash(): string {
    const { availableCards, availableTokens, winner } = this.state;
    return JSON.stringify({ availableCards, availableTokens, winner });
  }

  constructor(state?: RunningStateState | GameInstanceSettings) {
    super();

    if ("currentPlayer" in state) {
      this.state = state;
    } else {
      this.initialize(state);
    }
  }

  readonly availableActions = (): PlayerActionCommand[] =>
    this.gameOver
      ? []
      : Commands.flatMap(x => x.getAvailableActions(this)).filter(
          x => x != null
        );

  initialize(settings: GameInstanceSettings) {
    if (!settings) {
      throw new Error("No settings provided");
    }
    if (!settings.developmentCards || !settings.developmentCards.length) {
      throw new Error("No development cards provided");
    }
    if (!settings.players) {
      throw new Error("No players provided");
    }
    if (!settings.tokens) {
      throw new Error("No tokens provided");
    }

    const players = settings.players.map(
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

    const currentPlayer = players[Math.floor(Math.random() * players.length)];

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
      players,
      currentPlayer,
      availableCards,
      availableTokens,
      settings,
      winner: null,
      round: 0
    };

    this.populateVisibleCards();
  }

  calculateResults() {
    const rankings = this.players.map(({ name, prestigePoints }) => ({
      name,
      prestigePoints
    }));

    return { rankings };
  }

  private populateVisibleCards() {
    this.state.availableCards.forEach(row => {
      while (
        row.visibleCards.length < this.state.settings.visibleCardsPerRow &&
        row.stock.length !== 0
      ) {
        row.visibleCards.push(row.stock.pop());
      }
    });
  }

  private goToNextPlayer() {
    let nextPlayerIndex =
      this.players.findIndex(x => x.name === this.currentPlayer.name) + 1;

    // if we're at the end, go back to the beginning
    if (nextPlayerIndex >= this.players.length) {
      nextPlayerIndex = 0;
      this.state.round += 1;
    }

    this.state.currentPlayer = this.players[nextPlayerIndex];
  }

  beginTurn(): RunningState {
    recalculatePlayerTotals(this);
    this.populateVisibleCards();
    return this;
  }

  endTurn(): RunningState {
    recalculatePlayerTotals(this);

    const winner = this.players.find(
      x => x.prestigePoints >= this.state.settings.winningPoints
    );

    if (winner) {
      this.state.winner = winner;
      this.triggerNext();
    } else {
      this.goToNextPlayer();
    }

    return this;
  }
}
