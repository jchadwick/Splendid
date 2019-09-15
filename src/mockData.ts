import { importDeck } from "./util/deckGenerator";
import { RunningState } from "./ActiveGame/RunningState";
import { GameInstanceSettings } from "./StateContracts";
import { Player, ResourceCount, NativeResourceTypes } from "./Model";
import { times, createResourceCollection, clone } from "./utils";

const deckImportJob = importDeck();

export const generateDevelopmentCards = async () => clone(await deckImportJob);

let playerId = 0;
export const generatePlayer = async () =>
  ({
    name: `Player${++playerId}`,
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
  } as Player);

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
): Promise<GameInstanceSettings> =>
  Object.assign(
    {
      developmentCards: await generateDevelopmentCards(),
      players: await generatePlayers(),
      tokens: await generateTokens(),
      visibleCardsPerRow: 4,
      winningPoints: 15
    },
    settings
  );

export const generateRunningGameState = async (
  settings?: GameInstanceSettings
) =>
  new RunningState(
    Object.assign(await generateGameInstanceSettings(), settings)
  );
