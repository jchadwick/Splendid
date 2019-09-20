import { importDeck } from "./util/deckGenerator";
import { RunningState } from "./ActiveGame/RunningState";
import { GameInstanceSettings } from "./StateContracts";
import { Player, ResourceCount, NativeResourceTypes, GameState } from "./Model";
import { times, createResourceCollection, clone } from "./utils";
import { populateVisibleCards } from "./util";

const deckImportJob = importDeck();

export const generateDevelopmentCards = async () => clone(await deckImportJob);

let __playerId = 0;
export const generatePlayer = async (): Promise<Player> => {
  const playerId = ++__playerId;

  return {
    id: String(playerId),
    name: `Player${playerId}`,
    isHuman: false,
    patrons: [],
    playedCards: [],
    reservedCards: [],
    tokens: createResourceCollection(),
    prestigePoints: 0,
    totalResources: {
      cards: createResourceCollection(),
      tokens: createResourceCollection()
    }
  } as Player;
};

export const generatePlayers = async (count = 2) =>
  Promise.all(times(count)(generatePlayer));

export const generateTokens = async () =>
  NativeResourceTypes.reduce(
    (tokens, type) => {
      tokens[type] = 5;
      return tokens;
    },
    { Wild: 7 } as ResourceCount
  );

export const generateGameInstanceSettings = async (
  settings?: GameInstanceSettings
): Promise<GameInstanceSettings> => {
  const players = await generatePlayers();
  const deck = await generateDevelopmentCards();

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

  return Object.assign(
    {
      availableCards,
      availableTokens: createResourceCollection(),
      currentPlayerId: players[0].id,
      developmentCards: deck,
      players,
      tokens: await generateTokens(),
      visibleCardsPerRow: 4,
      winningPoints: 15
    },
    settings
  );
};

export const generateRunningGameState = async (
  settings?: GameInstanceSettings
): Promise<GameState> =>
  new RunningState(
    Object.assign(await generateGameInstanceSettings(), settings)
  );
