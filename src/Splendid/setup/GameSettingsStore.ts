import { action, observable, computed, toJS } from "mobx";

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  numberOfPlayers: number;
  players: Player[];
  multiplayer?: boolean | { local: true } | { server: string };
  debug?: boolean;
}

export class Player {
  private static __id = 0;
  id = `${(Player.__id += 1)}`;
  @observable name: string = "";
  @observable color: string = "gray";
  @observable isHuman: boolean = false;

  constructor({ name, isHuman = false }: { name?: string; isHuman?: boolean }) {
    this.name = name || `Player ${this.id}`;
    this.isHuman = isHuman;
  }

  @action
  toggleIsHuman(): void {
    this.isHuman = !this.isHuman;
  }
}

export class GameSettingsStore implements GameSettings {
  @observable
  musicVolume = 100;

  @observable
  sfxVolume = 100;

  @observable
  multiplayer;

  @observable
  debug = true;

  @observable
  readonly players = observable<Player>([]);

  @computed
  get canStartGame(): boolean {
    return this.numberOfPlayers >= 2 && this.numberOfPlayers <= 4;
  }

  @computed
  get canAddMorePlayers(): boolean {
    return this.players.length < 4;
  }

  @computed
  get numberOfPlayers(): number {
    return this.players.length;
  }

  constructor() {
    this.addPlayerRow();
    this.addPlayerRow();
  }

  @action
  readonly addPlayerRow = () =>
    this.players.push(new Player({ isHuman: this.players.length === 0 }));

  @action
  readonly removePlayer = playerId =>
    this.players.splice(this.players.findIndex(x => x.id === playerId), 1);

  @action
  readonly updatePlayer = (player: Player, updated: Map<keyof Player, any>) =>
    Object.assign(player, Object.fromEntries(updated));

  readonly toSettings = (): GameSettings => toJS(this);
}
