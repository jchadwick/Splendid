import { AllResourceTypes, ResourceType, ResourceCount } from "Model";
import React from "react";
import clsx from "clsx";

interface TokensProps {
  tokens: ResourceCount;
  showEmpty?: boolean;
  selectToken?(token: ResourceType): void;
}

export const Tokens = ({
  tokens,
  selectToken,
  showEmpty = true
}: TokensProps) => (
  <>
    {AllResourceTypes.map(
      token =>
        (tokens[token] || showEmpty) && (
          <div
            key={token}
            itemProp="token"
            className={clsx({ empty: (tokens[token] || 0) === 0 })}
            onClick={() => selectToken && selectToken(token)}
          >
            <div itemProp="resource" data-value={token} />
            <div itemProp="count" data-value={tokens[token] || 0} />
          </div>
        )
    )}
  </>
);
