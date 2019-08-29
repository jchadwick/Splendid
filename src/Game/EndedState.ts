import { PlayerRanking, GameInstanceResults, IGameState } from "./Contracts";

export class EndedState implements IGameState {
  readonly rankings: PlayerRanking[];

  get winner(): PlayerRanking {
    return this.rankings[0];
  }

  constructor(results: GameInstanceResults, private onReplay: () => void) {
    this.rankings = results.rankings.sort((a, b) =>
      b.prestigePoints.toString().localeCompare(a.prestigePoints.toString())
    );
  }

  triggerReplay() {
    this.onReplay();
  }
}
