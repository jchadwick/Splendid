import React from "react";
import GameClient from "./GameClient";
import GameSetup from "./setup";
import { useLocalStore, observer } from "mobx-react-lite";
import { GameSettings } from "./setup/GameSettingsStore";
import { observable, action, toJS } from "mobx";

class AppState {
  @observable
  settings: GameSettings = null;

  @observable
  view: React.FC = null;

  constructor() {
    this.nextState();
  }

  @action
  readonly nextState = (context?) => {
    switch ((this.view || {}).displayName) {
      case GameSetup.displayName:
        this.settings = context;
        this.view = () => <GameClient settings={toJS(this.settings)} />;
        this.view.displayName = GameClient.displayName;
        break;

      case GameClient.displayName:
        prompt("Game Over!");

      default:
        this.view = () => <GameSetup onReadyToStartGame={this.nextState} />;
        this.view.displayName = GameSetup.displayName;
        break;
    }
  };
}

const SplendidGame = observer(() => {
  const { view: View } = useLocalStore(() => new AppState());
  //return <View />;
  return (
    <GameClient
      settings={{
        numberOfPlayers: 2,
        musicVolume: 0,
        sfxVolume: 0,
        players: []
      }}
    />
  );
});
SplendidGame.displayName = "SplendidGame";

export default SplendidGame;
