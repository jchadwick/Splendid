import { GameContext, GameState} from "./model";

export type Moves = { [ key in keyof typeof moves ]: (...args) => void }

interface GameActionHandler {
    (G: GameState, ctx: GameContext, ...args): any
}

export const moves: { [ key: string ]: GameActionHandler } = {
    collectMultipleResources(G, ctx, id) {
        console.log(`[collectMultipleResources]`)
    },
    collectSingleResource(G, ctx, id) {
        console.log(`[collectSingleResource]`)
    },
    reserveDevelopmentCard(G, ctx, id) {
        console.log(`[reserveDevelopmentCard]`)
    },
    purchaseDevelopmentCard(G, ctx, id) {
        console.log(`[purchaseDevelopmentCard]`)
    },
  }