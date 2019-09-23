import React from "react";
import GameClient from "./GameClient";
import { observer } from "mobx-react-lite";

const SplendidGame = observer(() => {
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