import { GameState, NativeResourceTypes } from "../Model";
import { findCurrentPlayer } from "utils";

const TOKEN_MULTIPLIER = 1;
const WILD_MULTIPLIER = 3;
const CARD_MULTIPLIER = 5;
const PATRON_MULTIPLER = 20;
const POINT_MULTIPLIER = 50;

export const calculateScenarioScore = (state: GameState): number => {
  const player = findCurrentPlayer(state);
  const { patrons, playedCards, prestigePoints, tokens } = player;

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
