import { Game } from "boardgame.io/core";
import { GameState } from "../../Model";
import { moves, Moves } from "./GameMoves";
import { importDeck, shuffle } from "../../util";

const deck = importDeck();

shuffle(deck);

const availableCards = [
  {
    level: 3,
    stock: deck.filter(x => x.level === 3),
    visibleCards: Array(4).fill(null)
  },
  {
    level: 2,
    stock: deck.filter(x => x.level === 2),
    visibleCards: Array(4).fill(null)
  },
  {
    level: 1,
    stock: deck.filter(x => x.level === 1),
    visibleCards: Array(4).fill(null)
  }
];

const populateVisibleCards = cardRows => {
  cardRows.forEach(row => {
    for (let x = 0; x < row.visibleCards.length; x++) {
      if (row.visibleCards[x] == null && row.stock.length !== 0) {
        row.visibleCards[x] = row.stock.pop();
      }
    }
  });
};

populateVisibleCards(availableCards);

export const SplendidGame = Game<GameState, Moves>({
  setup: () => ({
    availableCards,
    availableTokens: {
      Wild: 7,
      Emerald: 5,
      Onyx: 5,
      Ruby: 5,
      Sapphire: 5,
      Diamond: 5
    },
    players: [
      {
        id: "0",
        name: "Player 1",
        isHuman: false,
        patrons: [],
        playedCards: [],
        tokens: {},
        prestigePoints: 0,
        reservedCards: [],
        totalResources: {}
      },
      {
        id: "1",
        name: "Player 2",
        isHuman: false,
        patrons: [],
        playedCards: [],
        tokens: {},
        prestigePoints: 0,
        reservedCards: [],
        totalResources: {}
      }
    ]
  }),

  moves,

  flow: {
    movesPerTurn: 1,
    onTurnBegin: (G, ctx) => {
      G.currentPlayer = G.players.find(x => x.id === ctx.currentPlayer);
    },
    onTurnEnd: (G, ctx) => {
      // TODO: evaluate patrons
      populateVisibleCards(G.availableCards);
    },
    endGameIf: G => {
      const winners = G.players.filter(x => x.prestigePoints >= 15);

      if (winners.length) {
        return { winner: winners[0].id };
      }
    }
  }
});
