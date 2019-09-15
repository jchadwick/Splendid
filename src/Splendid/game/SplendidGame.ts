import { Game } from "boardgame.io/core";
import { GameState } from "../../Model";
import { moves, Moves } from "./GameMoves";
import { initializeGame as setup } from "./initializeGame";
import { populateVisibleCards } from "../../util";

export const SplendidGame = Game<GameState, Moves>({
  setup,

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
