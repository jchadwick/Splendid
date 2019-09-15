import React from "react";
import { ResourceType, ResourceCount, AllResourceTypes } from "../../Model";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { ResourceColors } from "./ResourceColors";

const useTokenStyles = makeStyles(() =>
  createStyles({
    token: {
      backgroundColor: ({ resourceType }: TokenProps) =>
        ResourceColors[resourceType],
      border: "1px solid #333",
      borderRadius: 35,
      width: 70,
      height: 70,
      margin: "5px auto",
      cursor: ({ canSelect }: TokenProps) =>
        canSelect ? "pointer" : "not-allowed",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "120%",
      fontWeight: 600,
      color: "#FFF"
    }
  })
);

interface TokenProps {
  count: number;
  resourceType: ResourceType;
  canSelect: boolean;
  onResourceSelected?(type: ResourceType): void;
}

export const TokenStack: React.FC<TokenProps> = props => {
  const { canSelect, count, resourceType, onResourceSelected } = props;
  const styles = useTokenStyles(props);
  return (
    <div
      onClick={() => canSelect && onResourceSelected(resourceType)}
      className={styles.token}
    >
      {count}
    </div>
  );
};

interface TokensSectionProps {
  direction?: "row" | "column";
  tokens: ResourceCount;
  canSelectResource(type: ResourceType): boolean;
  onResourceSelected?(type: ResourceType): void;
}

export const TokensSection: React.FC<TokensSectionProps> = ({
  canSelectResource,
  direction = "column",
  tokens,
  onResourceSelected
}) => (
  <Box display="flex" flexDirection={direction}>
    {AllResourceTypes.map(type => (
      <TokenStack
        key={type.toString()}
        count={(tokens || {})[type] || 0}
        canSelect={canSelectResource(type)}
        onResourceSelected={onResourceSelected}
        resourceType={ResourceType[type]}
      />
    ))}
  </Box>
);
