import { Game } from "boardgame.io/core";
import { GameState, ResourceType, DevelopmentCard } from "./model";
import { moves } from "./GameMoves";

export const SplendidGame = Game<GameState>({
  setup: () => ({
    availableCards: [
      ...Array(3)
        .fill(0)
        .map((_, idx) => idx + 1)
        .map(level => ({
          level,
          stock: [],
          visibleCards: [
            {
              id: `${level}1`,
              level,
              resourceType: ResourceType.Diamond,
              cost: { tokens: { Onyx: 1 } }
            },
            {
              id: `${level}2`,
              level,
              resourceType: ResourceType.Emerald,
              cost: { tokens: { Ruby: 1 } }
            },
            {
              id: `${level}3`,
              level,
              resourceType: ResourceType.Onyx,
              cost: { tokens: { Sapphire: 1 } }
            },
            {
              id: `${level}4`,
              level,
              resourceType: ResourceType.Ruby,
              cost: { tokens: { Diamond: 1 } }
            },
            {
              id: `${level}5`,
              level,
              resourceType: ResourceType.Sapphire,
              cost: { tokens: { Emerald: 1 } }
            }
          ] as DevelopmentCard[]
        }))
    ],
    availableTokens: {
      Wild: 7,
      Gold: 5,
      Blue: 5,
      Silver: 5,
      Red: 5,
      Black: 5
    },
    players: [
      {
        id: "0",
        name: "Jess",
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
    endGameIf: G => {
      const winners = G.players.filter(x => x.prestigePoints >= 15);

      if (winners.length) {
        return { winner: winners[0].id };
      }
    }
  }
});
