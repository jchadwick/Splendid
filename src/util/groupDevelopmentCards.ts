import * as Model from "../Model";

export type DevelopmentCardGroup = {
  resourceType: Model.ResourceType;
  cards: Model.DevelopmentCard[];
};

export const groupDevelopmentCards = (
  cards: Model.DevelopmentCard[]
): DevelopmentCardGroup[] =>
  cards.reduce((grouped: DevelopmentCardGroup[], card) => {
    const { resourceType } = card;
    let group = grouped.find(x => x.resourceType === resourceType);

    if (group == null) {
      grouped.push({ resourceType, cards: [card] });
    } else {
      group.cards.push(card);
    }

    return Model.AllResourceTypes.map(type =>
      grouped.find(x => x.resourceType === type)
    ).filter(x => !!x);
  }, []);
