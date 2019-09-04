import { Game } from 'boardgame.io/core';
import { GameState, ResourceType, DevelopmentCard } from './model';
import { moves } from "./GameMoves";

function IsVictory(state: GameState) {
  return false;
}

function IsDraw(state: GameState) {
  return false
}

export const SplendidGame = Game({
  setup: () => ({ 
    availableCards: [
      { 
        level: 1, 
        stock: [ ], 
        visibleCards: [ 
          { id: "1", level: 1, resourceType: ResourceType.Diamond, cost: { tokens: { Onyx: 1 } } },
          { id: "2", level: 1, resourceType: ResourceType.Emerald, cost: { tokens: { Ruby: 1 } } },
          { id: "3", level: 1, resourceType: ResourceType.Onyx, cost: { tokens: { Sapphire: 1 } } },
          { id: "4", level: 1, resourceType: ResourceType.Ruby, cost: { tokens: { Diamond: 1 } } },
          { id: "4", level: 1, resourceType: ResourceType.Sapphire, cost: { tokens: { Emerald: 1 } } },
        ] as DevelopmentCard[]
      }
    ],
    availableTokens: {
      Wild: 7,
      Gold: 5,
      Blue: 5,
      Silver: 5,
      Red: 5,
      Black: 5
    }
  } as GameState),

  moves,

  flow: {
    movesPerTurn: 1,
    endGameIf: (G, ctx) => {
      if (IsVictory(G)) {
        return { winner: ctx.currentPlayer };
      }
      if (IsDraw(G)) {
        return { draw: true };
      }
    },
  },
});