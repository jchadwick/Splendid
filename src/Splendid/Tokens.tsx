import React from "react";
import * as Model from "./model";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { ResourceColors } from "./ResourceColors";

const useTokenStyles = makeStyles(() =>
  createStyles({
    token: {
      backgroundColor: ({ resourceType }: TokenProps) =>
        ResourceColors[resourceType],
      border: "1px solid #333",
      borderRadius: 40,
      width: 80,
      height: 80,
      margin: "10px auto",
      cursor: "pointer"
    }
  })
);

interface TokenProps {
  resourceType: Model.ResourceType;
  onResourceSelected?(type: Model.ResourceType): void;
}

export const TokenStack: React.FC<TokenProps> = props => {
  const { resourceType, onResourceSelected } = props;
  const styles = useTokenStyles(props);
  return (
    <div
      onClick={() => onResourceSelected(resourceType)}
      className={styles.token}
    >
      [{resourceType}]
    </div>
  );
};

export const TokensSection: React.FC<{
  onResourceSelected?(type: Model.ResourceType): void;
}> = ({ onResourceSelected }) => (
  <Box display="flex" flexDirection="column">
    <Box>
      {Model.NativeResourceTypes.map(type => (
        <TokenStack
          key={type.toString()}
          onResourceSelected={onResourceSelected}
          resourceType={Model.ResourceType[type]}
        />
      ))}
    </Box>
  </Box>
);
