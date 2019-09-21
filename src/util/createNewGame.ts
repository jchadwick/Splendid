import { GameState, Player } from "../Model";
import { GameInstanceSettings } from "../StateContracts";
import {
  createResourceCollection,
  add,
  clone,
  shuffle,
  populateVisibleCards
} from ".";

export const createNewGame = (settings?: GameInstanceSettings): GameState => {
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

  const players: Player[] = settings.playerInfo.map(
    ({ name, isHuman }, idx) => ({
      id: String(idx),
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
    })
  );

  const availableTokens = add(createResourceCollection(), settings.tokens);

  let deck = clone(settings.developmentCards);

  shuffle(deck);

  const availableCards = [
    {
      level: 1,
      stock: deck.filter(x => x.level === 1),
      visibleCards: Array(4)
    },
    {
      level: 2,
      stock: deck.filter(x => x.level === 2),
      visibleCards: Array(4)
    },
    {
      level: 3,
      stock: deck.filter(x => x.level === 3),
      visibleCards: Array(4)
    }
  ];

  populateVisibleCards(availableCards);

  return {
    currentPlayerId: players[0].id,
    players,
    availableCards,
    availableTokens
  };
};
