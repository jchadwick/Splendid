import { importDeck, shuffle, populateVisibleCards } from "../../util";

export const initializeGame = initial => {
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

  populateVisibleCards(availableCards);

  const players = Array(initial.numPlayers)
    .fill(0)
    .map((_, id) => ({
      id: String(id),
      name: `Player ${id + 1}`,
      isHuman: false,
      patrons: [],
      playedCards: [],
      tokens: {},
      prestigePoints: 0,
      reservedCards: [],
      totalResources: {}
    }));

  const availableTokens = {
    Wild: 7,
    Emerald: 5,
    Onyx: 5,
    Ruby: 5,
    Sapphire: 5,
    Diamond: 5
  };

  return {
    availableCards,
    availableTokens,
    players
  };
};
