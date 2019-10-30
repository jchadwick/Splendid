import { importDeck, shuffle, populateVisibleCards } from "../../util";
import { Player } from "Model";

export const initializeGame = initial => {
  const players: Player[] = Array(initial.numPlayers)
    .fill(0)
    .map(
      (_, id) =>
        ({
          id: String(id),
          name: `Player ${id + 1}`,
          isHuman: false,
          patrons: [],
          playedCards: [],
          tokens: {},
          prestigePoints: 0,
          reservedCards: [],
          totalResources: {}
        } as Player)
    );

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

  if (process.env.NODE_ENV !== "production") {
    players[0].tokens.Wild = 1;
    players[0].tokens.Diamond = 2;
    new Array(4).fill(0).forEach(() => {
      players[0].reservedCards.push(availableCards[2].stock.pop());
    });
    new Array(4).fill(0).forEach(() => {
      players[0].playedCards.push(availableCards[2].stock.pop());
    });

    players[1].tokens.Wild = 3;
    players[1].tokens.Sapphire = 3;
    players[1].tokens.Ruby = 2;
    new Array(4).fill(0).forEach(() => {
      players[1].reservedCards.push(availableCards[2].stock.pop());
    });
    new Array(4).fill(0).forEach(() => {
      players[1].playedCards.push(availableCards[2].stock.pop());
    });
  }

  populateVisibleCards(availableCards);

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
