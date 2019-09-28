import { AllResourceTypes } from "Model";
import React from "react";

export const Tokens = ({ availableTokens, selectToken }) => (
  <>
    {AllResourceTypes.map(token => (
      <div key={token} itemProp="token" onClick={() => selectToken(token)}>
        <div itemProp="resource" data-value={token} />
        <div itemProp="count" data-value={availableTokens[token]} />
      </div>
    ))}
  </>
);
