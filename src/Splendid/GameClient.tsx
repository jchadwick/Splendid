import { Client } from "boardgame.io/react";
import { observer } from "mobx-react-lite";
import React from "react";
import ai from "./ai";
import board from "./board";
import game from "./game";
import { GameSettings } from "./setup/GameSettingsStore";

const GameClient = observer<{ settings: GameSettings }>(({ settings }) => {
  const View = Client({
    game,
    board,
    ai,
    numPlayers: settings.numberOfPlayers,
    multiplayer: settings.multiplayer,
    debug: process.env.NODE_ENV !== "production"
  } as any);

  return <View />;
});

export default GameClient;
