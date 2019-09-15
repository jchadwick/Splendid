import React from "react";
import { Moves } from "../game/GameMoves";
import { DevelopmentCard, GameState } from "../../Model";
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
        "header header"
        "main  player-list"
        "footer footer"`
    },

    header: {
      gridArea: "header",
      fontSize: "200%",
      fontWeight: 900,
      padding: "0.2rem 2rem"
    },

    main: {
      gridArea: "main",
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
    footer: {
      gridArea: "footer"
    }
  })
);

export const MainBoard: React.FC<IBoardProps<GameState, Moves>> = props => {
  const { G } = props;

  const classes = useStyles(props);

  const { availableCards } = G;

  return (
    <div id="container" className={classes.container}>
      <div id="header" className={classes.header}>
        <div className="title">Awesome Demo</div>
      </div>
      <div id="main" className={classes.main}>
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
        {availableCards.map(row => (
          <div className="cardRow">
            <div className="stock card valid-action">
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
                      <div itemProp="token">
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
        <div className="player" itemScope itemType="urn:x:player" itemID="3">
          <div itemProp="name">Player 1</div>
          <div className="inventory">
            <div itemProp="inventory">
              <div className="cards">
                <div className="subtitle">Cards</div>
                <div itemProp="card">
                  <div itemProp="resource" data-value="Diamond"></div>
                  <div itemProp="prestigePoints" data-value="1"></div>
                  <div itemProp="cost">
                    <div itemProp="token">
                      <div itemProp="resource" data-value="Diamond"></div>
                      <div itemProp="count" data-value="2"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tokens">
                <div className="subtitle">Tokens</div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Diamond"></div>
                  <div itemProp="count" data-value="2"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Emerald"></div>
                  <div itemProp="count" data-value="3"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Sapphire"></div>
                  <div itemProp="count" data-value="1"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Onyx"></div>
                  <div itemProp="count" data-value="2"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Wild"></div>
                  <div itemProp="count" data-value="2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="player" itemScope itemType="urn:x:player" itemID="3">
          <div itemProp="name">Player 2</div>
          <div className="inventory">
            <div itemProp="inventory">
              <div className="cards">
                <div className="subtitle">Cards</div>
                <div itemProp="card">
                  <div itemProp="resource" data-value="Diamond"></div>
                  <div itemProp="prestigePoints" data-value="1"></div>
                  <div itemProp="cost">
                    <div itemProp="token">
                      <div itemProp="resource" data-value="Diamond"></div>
                      <div itemProp="count" data-value="2"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tokens">
                <div className="subtitle">Tokens</div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Diamond"></div>
                  <div itemProp="count" data-value="2"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Emerald"></div>
                  <div itemProp="count" data-value="3"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Sapphire"></div>
                  <div itemProp="count" data-value="1"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Onyx"></div>
                  <div itemProp="count" data-value="2"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Wild"></div>
                  <div itemProp="count" data-value="2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="player" itemScope itemType="urn:x:player" itemID="3">
          <div itemProp="name">Player 3</div>
          <div className="inventory">
            <div itemProp="inventory">
              <div className="cards">
                <div className="subtitle">Cards</div>
                <div itemProp="card">
                  <div itemProp="resource" data-value="Diamond"></div>
                  <div itemProp="prestigePoints" data-value="1"></div>
                  <div itemProp="cost">
                    <div itemProp="token">
                      <div itemProp="resource" data-value="Diamond"></div>
                      <div itemProp="count" data-value="2"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tokens">
                <div className="subtitle">Tokens</div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Diamond"></div>
                  <div itemProp="count" data-value="2"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Emerald"></div>
                  <div itemProp="count" data-value="3"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Sapphire"></div>
                  <div itemProp="count" data-value="1"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Onyx"></div>
                  <div itemProp="count" data-value="2"></div>
                </div>
                <div itemProp="token">
                  <div itemProp="resource" data-value="Wild"></div>
                  <div itemProp="count" data-value="2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="footer" className={classes.footer}>
        footer
      </div>
    </div>
  );
};
