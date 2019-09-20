import { GameState, Player } from "../Model";

export const getWinners = (state: GameState): Player[] =>
  (state && state.players.filter(x => x.prestigePoints >= 15)) || [];
