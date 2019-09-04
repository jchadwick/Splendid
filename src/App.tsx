import React from "react";
import { Client } from 'boardgame.io/react';
import Splendid from "./Splendid"

const GameClient = Client(Splendid);
const App = () => <>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <GameClient />
</>

export default App;