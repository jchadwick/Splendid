import {
  PlayerRanking,
  GameInstanceResults,
  GameStateBase
} from "../StateContracts";

export class EndedState extends GameStateBase {
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
