import { Snackbar } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { IBoardProps } from "boardgame.io/react";
import React, { useCallback, useEffect, useState } from "react";
import * as Model from "../../Model";
import {
  calculatePlayerResourceTotals,
  findCurrentPlayer,
  findPlayer,
  hasRequiredResources
} from "../../util";
import { Moves } from "../game";
import "./board.css";
import { Overlay } from "./components";
import { GameOver } from "./GameOver";
import { MainBoard } from "./MainBoard";
import { PlayerList } from "./PlayerList";
import { Tokens } from "./Tokens";
import { UserPlayerInventory } from "./UserPlayerInventory";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      color: "#000",
      backgroundColor: "#fff",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: "calc(100vw/75)",
      height: "100vh",
      display: "grid",
      gridColumnGap: "0.4rem",
      gridRowGap: "0.4rem",
      gridTemplateColumns: "auto 3rem calc(25% - 0.4rem)",
      gridTemplateRows: "calc(75% - 0.4rem) 25%",
      gridTemplateAreas: `
        "board      tokens    player-list"
        "inventory  inventory inventory"`
    },

    tokens: {
      gridArea: "tokens",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-around",
      fontSize: "1.9rem",

      "& [itemProp='token']": {
        display: "flex",
        flexDirection: "column"
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
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly"
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
      gridArea: "inventory",
      display: "flex"
    }
  })
);

export const GameLayout: React.FC<
  Partial<IBoardProps<Model.GameState, Moves>>
> = props => {
  const {
    G: state,
    G: { availableCards, availableTokens, currentPlayerId, players },
    ctx: { gameover },
    playerID,
    moves,
    step
  } = props;

  const classes = useStyles({});
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  const userPlayerId = playerID || players[0].id;

  const [selectedTokens, setSelectedTokens] = useState([]);
  const currentPlayer = findCurrentPlayer(state);
  const userPlayer = findPlayer(players, userPlayerId);
  const otherPlayers = players.filter(x => x.id !== userPlayerId);
  const isUserPlayersTurn = userPlayerId === currentPlayerId;

  useEffect(() => {
    setSelectedTokens([]);

    if (currentPlayerId !== userPlayerId) {
      step();
    }
  }, [step, currentPlayerId, userPlayerId]);

  const selectToken = useCallback(
    token => {
      if (token === Model.ResourceType.Wild) {
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

  const showWarning = (message: string) => {
    setSnackbarMessage(message);
    setIsSnackbarVisible(true);
  };

  const selectDevelopmentCard = (card: Model.DevelopmentCard): void => {
    const playerResources = calculatePlayerResourceTotals(currentPlayer);

    if (hasRequiredResources(card.cost, playerResources)) {
      moves.purchaseDevelopmentCard(card);
    } else {
      moves.reserveDevelopmentCard(card);
    }
  };

  const playReservedCard = (card: Model.DevelopmentCard): void => {
    const playerResources = calculatePlayerResourceTotals(currentPlayer);

    if (hasRequiredResources(card.cost, playerResources)) {
      moves.purchaseDevelopmentCard(card);
    } else {
      showWarning("Not enough resources to purchase this card!");
    }
  };

  return (
    <>
      {gameover && (
        <GameOver
          onClose={() => window.location.reload()}
          results={gameover}
          userPlayer={userPlayer}
        />
      )}
      <Overlay isActive={!isUserPlayersTurn} />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={isSnackbarVisible}
        onClose={() => setIsSnackbarVisible(false)}
        autoHideDuration={2000}
        message={snackbarMessage}
      />
      <div id="container" className={classes.container}>
        <div id="tokens" className={classes.tokens}>
          <Tokens availableTokens={availableTokens} selectToken={selectToken} />
        </div>
        <div id="board" className={classes.board}>
          <MainBoard
            availableCards={availableCards}
            selectDevelopmentCard={selectDevelopmentCard}
          />
        </div>
        <div id="player-list" className={classes.playerList}>
          <PlayerList players={otherPlayers} currentPlayer={currentPlayer} />
        </div>
        <div id="inventory" className={classes.inventory}>
          {userPlayer && (
            <UserPlayerInventory
              isCurrentPlayer={userPlayer.id === currentPlayerId}
              player={userPlayer}
              onPlayReservedCard={playReservedCard}
            />
          )}
        </div>
      </div>
    </>
  );
};
