import React, { useCallback, useState } from "react";
import { Moves } from "../game/GameMoves";
import { DevelopmentCard, GameState, ResourceType, Player } from "../../Model";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { IBoardProps } from "boardgame.io/react";

import "./board.css";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      color: "#000",
      backgroundColor: "#fff",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      width: "100%",
      height: "100vh",
      display: "grid",
      gridColumnGap: 5,
      gridRowGap: 5,
      gridTemplateColumns: "auto 25%",
      gridTemplateRows: "5% auto 10%",
      gridTemplateAreas: `
        "tokens    player-list"
        "board     player-list"
        "inventory player-list"`
    },

    tokens: {
      gridArea: "tokens",
      display: "flex",
      alignContent: "center",
      justifyContent: "space-around",

      "& [itemProp='token']": {
        display: "flex",
        flexDirection: "column",
        fontSize: "350%"
      },

      "& [itemProp='token'] [itemProp='resource']": {},

      "& [itemProp='token'] [itemProp='count']": {
        position: "absolute",
        padding: ".4em",
        fontSize: "60%",
        fontWeight: 900
      },

      "& [itemprop='resource'][data-value='Onyx'] + [itemProp='count']": {
        color: "#fff"
      }
    },

    board: {
      gridArea: "board",
      padding: "0 1rem 0.5rem"
    },

    playerList: {
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      gridArea: "player-list",
      backgroundColor: "#fff",
      padding: "0.4em"
    },
    inventory: {
      gridArea: "inventory"
    }
  })
);

export const MainBoard: React.FC<IBoardProps<GameState, Moves>> = props => {
  const {
    G: { availableCards, availableTokens, currentPlayer, players },
    moves
  } = props;

  return (
    <MainBoardView
      {...{
        availableCards,
        availableTokens,
        currentPlayer,
        moves,
        players
      }}
    />
  );
};

export const MainBoardView = ({
  availableCards,
  availableTokens,
  currentPlayer,
  moves,
  players
}) => {
  const classes = useStyles({});

  const [selectedTokens, setSelectedTokens] = useState([]);
  const userPlayer = currentPlayer;

  const selectToken = useCallback(
    token => {
      if (token === ResourceType.Wild) {
        console.debug(`Ignoring invalid selection of a wild token`);
        return;
      }

      let newSelectedTokens = selectedTokens;

      if (selectedTokens.indexOf(token) > -1) {
        if (selectedTokens.length === 1) {
          moves.collectSingleResource(token);
          newSelectedTokens = [];
        } else {
          console.debug(`Ignoring invalid duplicate selection of ${token}`);
        }
      } else {
        newSelectedTokens = [...selectedTokens, token];
      }

      if (newSelectedTokens.length === 3) {
        moves.collectMultipleResources(newSelectedTokens);
        newSelectedTokens = [];
      }

      setSelectedTokens(newSelectedTokens);
    },
    [moves, selectedTokens]
  );

  return (
    <div id="container" className={classes.container}>
      <div className={classes.tokens}>
        {Object.keys(availableTokens).map(token => (
          <div key={token} itemProp="token" onClick={() => selectToken(token)}>
            <div itemProp="resource" data-value={token}></div>
            <div itemProp="count" data-value={availableTokens[token]}></div>
          </div>
        ))}
      </div>
      <div id="board" className={classes.board}>
        <div className={`patron cardRow`}>
          <div className="patron card">
            <span>Patron</span>
          </div>
          <div className="patron card">
            <span>Patron</span>
          </div>
          <div className="patron card">
            <span>Patron</span>
          </div>
          <div className="patron card">
            <span>Patron</span>
          </div>
          <div className="patron card">
            <span>Patron</span>
          </div>
        </div>
        {availableCards.map((row, rowIndex) => (
          <div key={String(rowIndex)} className="cardRow">
            <div
              className="stock card valid-action"
              onClick={() =>
                moves.reserveDevelopmentCard(row.stock[row.stock.length - 1])
              }
            >
              <span>{row.stock.length}</span>
            </div>
            {Array(4)
              .fill(0)
              .map(
                (_, i) =>
                  (row.visibleCards[i] ||
                    ({
                      cost: { cards: {}, tokens: {} }
                    } as any)) as DevelopmentCard
              )
              .map((card, idx) => (
                <div
                  key={card.id || `${row.level}${idx}`}
                  className={`card ${card.id ? "valid-action" : ""}`}
                  itemProp="card"
                  onClick={() => moves.reserveDevelopmentCard(card)}
                >
                  <div itemProp="resource" data-value={card.resourceType}></div>
                  {card.prestigePoints > 0 && (
                    <div
                      itemProp="prestigePoints"
                      data-value={card.prestigePoints}
                    ></div>
                  )}
                  <div itemProp="cost">
                    {Object.keys(card.cost.tokens).map(resource => (
                      <div key={resource} itemProp="token">
                        <div itemProp="resource" data-value={resource}></div>
                        <div
                          itemProp="count"
                          data-value={card.cost.tokens[resource]}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      <div id="player-list" className={classes.playerList}>
        {players.map(player => (
          <PlayerOverview
            isCurrentPlayer={player === currentPlayer}
            player={player}
          />
        ))}
      </div>
      <div id="inventory" className={classes.inventory}>
        <UserPlayerInventory player={userPlayer} />
      </div>
    </div>
  );
};

const PlayerOverview = ({
  isCurrentPlayer,
  player
}: {
  isCurrentPlayer: boolean;
  player: Player;
}) => (
  <div
    className="player"
    itemScope
    itemType="urn:x:player"
    itemID={String(player.id)}
  >
    <div itemProp="name">
      {player.name} {isCurrentPlayer && "(Current)"}{" "}
    </div>
    <div className="inventory">
      <PlayerInventory
        reservedCards={player.reservedCards}
        tokens={player.tokens}
      />
    </div>
  </div>
);

const PlayerInventory = ({ reservedCards, tokens }) => (
  <div itemProp="inventory">
    <div className="cards">
      <div className="subtitle">Cards</div>
      <div itemProp="card-count" data-value={reservedCards.length} />
    </div>
    <div className="tokens">
      <div className="subtitle">Tokens</div>

      {Object.keys(tokens).map(resource => (
        <div itemProp="token">
          <div itemProp="resource" data-value={resource}></div>
          <div itemProp="count" data-value={tokens[resource]}></div>
        </div>
      ))}
    </div>
  </div>
);

const UserPlayerInventory = ({ player }: { player: Player }) => (
  <div>[PLAYER INVENTORY]</div>
);
