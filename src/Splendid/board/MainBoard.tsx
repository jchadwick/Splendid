import React, { useCallback, useState, useEffect } from "react";
import { Moves } from "../game";
import {
  DevelopmentCard as DevelopmentCardModel,
  GameState,
  ResourceType,
  Player,
  GameResults
} from "../../Model";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { IBoardProps } from "boardgame.io/react";

import "./board.css";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button
} from "@material-ui/core";
import {
  findCurrentPlayer,
  findPlayer,
  hasRequiredResources,
  calculatePlayerResourceTotals
} from "../../util";
import { styled } from "@material-ui/styles";

const Column = styled(Box)({ display: "flex", flexDirection: "column" });
const Row = styled(Box)({ display: "flex", flexDirection: "row" });
const Overlay = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: ({ isActive }: { isActive: boolean }) => `${isActive ? 100 : 0}vh`,
  zIndex: 1000
});

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      color: "#000",
      backgroundColor: "#fff",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      width: "calc(100% - 310px)",
      height: "100vh",
      display: "grid",
      gridColumnGap: 5,
      gridRowGap: 5,
      gridTemplateColumns: "auto 25%",
      gridTemplateRows: "6em auto 13em",
      gridTemplateAreas: `
        "tokens    player-list"
        "board     player-list"
        "inventory player-list"`
    },

    tokens: {
      gridArea: "tokens",
      display: "flex",
      alignItems: "center",
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
      gridArea: "inventory",
      display: "flex"
    }
  })
);

export const MainBoard: React.FC<
  Partial<IBoardProps<GameState, Moves>>
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

  const userPlayerId = playerID || players[0].id;

  const [selectedTokens, setSelectedTokens] = useState([]);
  const currentPlayer = findCurrentPlayer(state);
  const userPlayer: Player = findPlayer(players, userPlayerId);
  const otherPlayers = players.filter(x => x.id !== userPlayerId);
  const isUserPlayersTurn = userPlayerId === currentPlayerId;

  useEffect(() => {
    if (currentPlayerId !== userPlayerId) {
      step();
    }
  }, [step, currentPlayerId, userPlayerId]);

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

  const selectDevelopmentCard = (card: DevelopmentCardModel): void => {
    const playerResources = calculatePlayerResourceTotals(currentPlayer);

    if (hasRequiredResources(card.cost, playerResources)) {
      moves.purchaseDevelopmentCard(card);
    } else {
      moves.reserveDevelopmentCard(card);
    }
  };

  return (
    <>
      {gameover && (
        <GameOver
          onClose={() => console.log("GameOver closed")}
          results={gameover}
          userPlayer={userPlayer}
        />
      )}
      <Overlay isActive={!isUserPlayersTurn} />
      <div id="container" className={classes.container}>
        <div id="tokens" className={classes.tokens}>
          {Object.keys(availableTokens).map(token => (
            <div
              key={token}
              itemProp="token"
              onClick={() => selectToken(token)}
            >
              <div itemProp="resource" data-value={token} />
              <div itemProp="count" data-value={availableTokens[token]} />
            </div>
          ))}
        </div>
        <div id="board" className={classes.board}>
          {availableCards.map((row, rowIndex) => (
            <div key={String(rowIndex)} className="cardRow">
              <div
                className="stock card valid-action"
                onClick={() =>
                  row.stock.length
                    ? selectDevelopmentCard(row.stock[row.stock.length - 1])
                    : false
                }
              >
                <span>{row.stock.length}</span>
              </div>
              {Array(4)
                .fill(0)
                .map(
                  (_, i) =>
                    row.visibleCards[i] ||
                    ({ id: null } as DevelopmentCardModel)
                )
                .map((card, idx) => (
                  <DevelopmentCard
                    key={card.id || `${row.level}${idx}`}
                    card={card}
                    onSelected={selectDevelopmentCard}
                  />
                ))}
            </div>
          ))}
        </div>
        <div id="player-list" className={classes.playerList}>
          {otherPlayers.map((player: Player) => (
            <PlayerOverview
              key={player.id}
              isCurrentPlayer={player === currentPlayer}
              player={player}
            />
          ))}
          <div className={`patronRow`}>
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
        </div>
        <div id="inventory" className={classes.inventory}>
          {userPlayer && (
            <UserPlayerInventory
              isCurrentPlayer={userPlayer.id === currentPlayerId}
              player={userPlayer}
              onPlayReservedCard={card => moves.purchaseDevelopmentCard(card)}
            />
          )}
        </div>
      </div>
    </>
  );
};

interface GameOverProps {
  userPlayer: Player;
  results: GameResults;
  onClose(): any;
}

const GameOver = ({ results, onClose, userPlayer }: GameOverProps) => (
  <Dialog open onClose={onClose} aria-labelledby="customized-dialog-title">
    <DialogTitle>GAME OVER</DialogTitle>
    <DialogContent dividers>
      <Typography gutterBottom>
        {results.winner === userPlayer ? (
          <Typography>YOU WIN!</Typography>
        ) : (
          <Typography>You lose - get off my property</Typography>
        )}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        New Game
      </Button>
    </DialogActions>
  </Dialog>
);

const DevelopmentCard = ({
  card,
  onSelected,
  canSelect
}: {
  card: DevelopmentCardModel;
  canSelect?: boolean;
  onSelected(card: DevelopmentCardModel): void;
}) => (
  <div
    className={`card ${card.id || canSelect ? "valid-action" : ""}`}
    itemProp="card"
    onClick={() => (card.id || canSelect ? onSelected(card) : false)}
  >
    <div itemProp="resource" data-value={card.resourceType} />
    {card && card.prestigePoints > 0 && (
      <div itemProp="prestigePoints" data-value={card.prestigePoints} />
    )}
    <div itemProp="cost">
      {card &&
        card.cost &&
        Object.keys(card.cost.tokens).map(resource => (
          <div key={resource} itemProp="token">
            <div itemProp="resource" data-value={resource} />
            <div itemProp="count" data-value={card.cost.tokens[resource]} />
          </div>
        ))}
    </div>
  </div>
);

const PlayerOverview = ({
  isCurrentPlayer,
  player
}: {
  isCurrentPlayer: boolean;
  player: Player;
}) => (
  <div
    className={`player ${isCurrentPlayer && "active"}`}
    itemScope
    itemType="urn:x:player"
    itemID={String(player.id)}
  >
    <div itemProp="name">
      {player.name}{" "}
      {isCurrentPlayer && (
        <span dangerouslySetInnerHTML={{ __html: "&Star;" }} />
      )}
    </div>
    <div itemProp="prestigePoints">{player.prestigePoints}</div>
    <div className="inventory">
      <PlayerInventory player={player} />
    </div>
  </div>
);

interface PlayerInventoryProps {
  player: Player;
}

interface PlayedCardProps {
  card: DevelopmentCardModel;
}

const PlayedCard = ({ card }: PlayedCardProps) => (
  <Box width="2em" height="3em">
    <div itemProp="resource" data-value={card.resourceType} />
    <div itemProp="prestigePoints" data-value={card.prestigePoints} />
  </Box>
);

const PlayerInventory = ({
  player: { playedCards, reservedCards, tokens }
}: PlayerInventoryProps) => (
  <div itemProp="inventory">
    <Row justifyContent="space-between" flexWrap="wrap">
      <Column display="flex" alignContent="center" justifyContent="center">
        {reservedCards.length}
      </Column>
      {playedCards.map(card => (
        <PlayedCard card={card} />
      ))}
    </Row>
    <div className="tokens">
      <div className="subtitle">Tokens</div>

      {Object.keys(tokens).map(
        resource =>
          tokens[resource] > 0 && (
            <div key={resource} itemProp="token">
              <div itemProp="resource" data-value={resource} />
              <div itemProp="count" data-value={tokens[resource]} />
            </div>
          )
      )}
    </div>
  </div>
);

const CurrentPlayerName = styled("h3")({
  writingMode: "vertical-lr",
  textOrientation: "upright"
});

const UserPlayerInventory = ({
  isCurrentPlayer,
  player,
  onPlayReservedCard
}: {
  isCurrentPlayer: boolean;
  player: Player;
  onPlayReservedCard(card: DevelopmentCardModel): void;
}) => (
  <Row position="relative" flexGrow={1} className={isCurrentPlayer && "active"}>
    <Box className="prestigePoints" position="absolute" top="1rem" right="1rem">
      {player.prestigePoints}
    </Box>
    <CurrentPlayerName>{player.name}</CurrentPlayerName>
    <Row>
      <Row border="1px solid #333">
        <Row id="playerTokens" fontSize="160%" flexWrap="wrap" width="5rem">
          {Object.keys(player.tokens).map(
            resource =>
              player.tokens[resource] > 0 && (
                <div key={resource} itemProp="token">
                  <div itemProp="resource" data-value={resource} />
                  <div itemProp="count" data-value={player.tokens[resource]} />
                </div>
              )
          )}
        </Row>
        <Row id="reservedCards">
          {player.reservedCards.map(card => (
            <DevelopmentCard
              key={card.id}
              card={card}
              onSelected={onPlayReservedCard}
            />
          ))}
        </Row>
      </Row>
      <Row>
        <Row id="playedCards">
          {groupCards(player.playedCards).map(({ resourceType, cards }) => (
            <Box
              className={`cardStack ${resourceType}`}
              position="relative"
              width="9em"
            >
              {cards.map((card, idx) => (
                <Box
                  position="absolute"
                  top={`${idx * 3}em`}
                  width="7em"
                  paddingRight="1em"
                >
                  <DevelopmentCard
                    key={card.id}
                    card={card}
                    onSelected={() => null}
                  />
                </Box>
              ))}
            </Box>
          ))}
        </Row>
      </Row>
    </Row>
  </Row>
);

type DevelopmentCardGroup = {
  resourceType: ResourceType;
  cards: DevelopmentCardModel[];
};

const groupCards = (cards: DevelopmentCardModel[]): DevelopmentCardGroup[] =>
  cards.reduce((grouped: DevelopmentCardGroup[], card) => {
    const { resourceType } = card;
    let group = grouped.find(x => x.resourceType === resourceType);

    if (group == null) {
      grouped.push({ resourceType, cards: [card] });
    } else {
      group.cards.push(card);
    }

    return grouped;
  }, []);
