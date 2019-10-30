import React from "react";
import GameClient from "./GameClient";
import { observer } from "mobx-react-lite";

const SplendidGame = observer(() => {
  return (
    <GameClient
      settings={{
        debug: process.env.NODE_ENV !== "production",
        numberOfPlayers: 4,
        musicVolume: 0,
        sfxVolume: 0,
        players: []
      }}
    />
  );
});
SplendidGame.displayName = "SplendidGame";

export default SplendidGame;
