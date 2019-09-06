import React from "react";
import { Client } from "boardgame.io/react";
import Splendid from "./Splendid";

const GameClient = Client(Splendid);

const [_, playerID] = [
  ...(/playerID=([0-9]*)/.exec(window.location.search.substr(1)) || [])
];

console.debug(`Player ID: ${playerID}`);

export default () => <GameClient playerID={playerID || "0"} />;
