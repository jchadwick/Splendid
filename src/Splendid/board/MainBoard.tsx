import React from "react";
import * as Model from "../../Model";
import { DevelopmentCard } from "./DevelopmentCard";

export const MainBoard = ({ availableCards, selectDevelopmentCard }) => (
  <>
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
              row.visibleCards[i] || ({ id: null } as Model.DevelopmentCard)
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
  </>
);
