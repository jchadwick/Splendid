import { GameResults } from "../../Model";
import moves from "./moves";
import { initializeGame as setup } from "./initializeGame";
import { populateVisibleCards } from "../../util";

export type Moves = { [key in keyof typeof moves]: (...args) => void };

export const SplendidGame = {
  setup,

  moves,

  turn: {
    moveLimit: 1,
    onBegin: (G, ctx) => {
      G.currentPlayerId = ctx.currentPlayer;
    },
    onEnd: (G, ctx) => {
      // TODO: evaluate patrons
      populateVisibleCards(G.availableCards);
    }
  },
  endIf: (G): GameResults | void => {
    const winners = G.players.filter(x => x.prestigePoints >= 15);

    if (winners.length) {
      const rankings = [...G.players].sort(
        (a, b) => b.prestigePoints - a.prestigePoints
      );
      return { winner: winners[0], rankings };
    }
  }
};
