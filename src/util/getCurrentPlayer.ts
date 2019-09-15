import { GameState } from "Model";

export const getCurrentPlayer = (state: GameState, playerId: string) =>
  state.players.find(x => x.id === playerId);
