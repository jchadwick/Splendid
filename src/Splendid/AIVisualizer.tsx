import React from "react";
import { GameState } from "Model";
import { findCurrentPlayer } from "../util";

export const AIVisualizer = ({ G }: { G: GameState }) => {
  const player = findCurrentPlayer(G);

  return player == null ? null : (
    <div style={{ transform: "scale(0.4)" }}>
      <table>
        <tr>
          <th>Prestige</th>
          <td>{player.prestigePoints}</td>
        </tr>
        <tr>
          <th>Cards</th>
          <td>
            P: {player.playedCards} | R: {player.reservedCards}
          </td>
        </tr>
        <tr>
          <th>Tokens</th>
          <td>
            {Object.keys(player.tokens).reduce(
              (total, tok) => (total += player.tokens[tok]),
              0
            )}
          </td>
        </tr>
      </table>
    </div>
  );
};
