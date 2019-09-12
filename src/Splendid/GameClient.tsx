import React from "react";
import { Client } from "boardgame.io/react";
import game from "./game";
import board from "./board";
import ai from "./ai";
import { observer } from "mobx-react-lite";
import { GameSettings } from "./setup/GameSettingsStore";

const GameClient = observer<{ settings: GameSettings }>(({ settings }) => {
  debugger;
  const View = Client({
    game,
    board,
    ai,
    numPlayers: settings.numberOfPlayers,
    multiplayer: settings.multiplayer,
    debug: settings.debug
  } as any);

  return <View />;
});

export default GameClient;
