import { GameState, NativeResourceTypes } from "../Model";

const TOKEN_MULTIPLIER = 1;
const WILD_MULTIPLIER = 3;
const CARD_MULTIPLIER = 5;
const PATRON_MULTIPLER = 20;
const POINT_MULTIPLIER = 50;

export const calculateScenarioScore = (state: GameState): number => {
  if (!state.currentPlayer) {
    throw Error("THERE IS NO CURRENT PLAYER - THIS SHOULD NEVER HAPPEN!");
  }

  const { patrons, playedCards, prestigePoints, tokens } = state.currentPlayer;

  const tokenCount = NativeResourceTypes.reduce(
    (total, type) => total + tokens[type],
    0
  );

  const score =
    tokenCount * TOKEN_MULTIPLIER +
    tokens.Wild * WILD_MULTIPLIER +
    playedCards.length * CARD_MULTIPLIER +
    patrons.length * PATRON_MULTIPLER +
    prestigePoints * POINT_MULTIPLIER;

  return score;
};
