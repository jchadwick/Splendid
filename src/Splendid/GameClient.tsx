import React from "react";
import { Client } from "boardgame.io/react";
import game from "./game";
import board from "./board";
import ai from "./ai";

const GameClient = Client({
  game,
  board,
  ai
} as any);

export default () => <GameClient />;
