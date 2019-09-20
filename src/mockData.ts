import { importDeck } from "./util/deckGenerator";
import { GameInstanceSettings } from "./StateContracts";
import { Player, ResourceCount, NativeResourceTypes } from "./Model";
import { times, createResourceCollection, clone, createNewGame } from "./util";

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
  settings?: Partial<GameInstanceSettings>
): Promise<GameInstanceSettings> => ({
  developmentCards: await generateDevelopmentCards(),
  playerInfo: await generatePlayers(),
  tokens: await generateTokens(),
  visibleCardsPerRow: 4,
  winningPoints: 15,
  ...settings
});

export const generateGameState = async () =>
  createNewGame(await generateGameInstanceSettings());
