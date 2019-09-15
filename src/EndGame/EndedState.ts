import {
  PlayerRanking,
  GameInstanceResults,
  GameState
} from "../StateContracts";

export class EndedState extends GameState {
  readonly rankings: PlayerRanking[];

  get winner(): PlayerRanking {
    return this.rankings[0];
  }

  constructor(results: GameInstanceResults) {
    super();
    this.rankings = results.rankings.sort((a, b) =>
      b.prestigePoints.toString().localeCompare(a.prestigePoints.toString())
    );
  }
}
