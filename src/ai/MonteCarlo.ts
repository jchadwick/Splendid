interface Action {
  hash(): string;
}

interface State {
  hash(): string;
  isPlayer(player: InstanceId): boolean;
}

type InstanceId = null | string | 0;

interface MonteCarloConfiguration<
  TState extends State,
  TAction extends Action
> {
  legalPlays(state: TState): TAction[];
  nextState(state: TState, action: TAction): TState;
  winner(state: TState): InstanceId;
}

/**
 * Class representing the Monte Carlo search tree.
 * Handles the four MCTS steps: selection, expansion, simulation, backpropagation.
 * Handles best-move selection.
 *
 * @see https://medium.com/@quasimik/implementing-monte-carlo-tree-search-in-node-js-5f07595104df
 * @see https://github.com/quasimik/medium-mcts/
 */
export class MonteCarlo<TState extends State, TAction extends Action> {
  nodes = new Map();

  /**
   * Create a Monte Carlo search tree.
   * @param {Game} game - The game to query regarding legal moves and state advancement.
   * @param {number} UCB1ExploreParam - The square of the bias parameter in the UCB1 algorithm; defaults to 2.
   */
  constructor(
    public game: MonteCarloConfiguration<TState, TAction>,
    public UCB1ExploreParam = 2
  ) {}

  /**
   * If state does not exist, create dangling node.
   * @param {State} state - The state to make a dangling node for; its parent is set to null.
   */
  makeNode(state: TState) {
    if (!this.nodes.has(state.hash())) {
      let unexpandedPlays = this.game.legalPlays(state).slice();
      let node = new MonteCarloNode(null, null, state, unexpandedPlays);
      this.nodes.set(state.hash(), node);
    }
  }

  /**
   * From given state, run as many simulations as possible until the time limit, building statistics.
   * @param {State} state - The state to run the search from.
   * @param {number} timeout - The time to run the simulations for, in seconds.
   * @return {Object} Search statistics.
   */
  runSearch(state: TState, timeout = 3) {
    this.makeNode(state);

    let draws = 0;
    let totalSims = 0;

    let end = Date.now() + timeout * 1000;

    while (Date.now() < end) {
      let node = this.select(state);
      let winner = this.game.winner(node.state);

      if (node.isLeaf() === false && winner === null) {
        node = this.expand(node);
        winner = this.simulate(node);
      }
      this.backpropagate(node, winner);

      if (winner === 0) draws++;
      totalSims++;
    }

    return { runtime: timeout, simulations: totalSims, draws: draws };
  }

  /**
   * From the available statistics, calculate the best move from the given state.
   * @param {State} state - The state to get the best play from.
   * @param {string} policy - The selection policy for the "best" play.
   * @return {Play} The best play, according to the given policy.
   */
  bestPlay(state: TState, policy: "robust" | "max" = "max") {
    this.makeNode(state);

    // If not all children are expanded, not enough information
    if (this.nodes.get(state.hash()).isFullyExpanded() === false)
      throw new Error("Not enough information!");

    let node = this.nodes.get(state.hash());
    let allPlays = node.allPlays();
    let bestPlay;

    // Most visits (robust child)
    if (policy === "robust") {
      let max = -Infinity;
      for (let play of allPlays) {
        let childNode = node.childNode(play);
        if (childNode.n_plays > max) {
          bestPlay = play;
          max = childNode.n_plays;
        }
      }
    }

    // Highest winrate (max child)
    else if (policy === "max") {
      let max = -Infinity;
      for (let play of allPlays) {
        let childNode = node.childNode(play);
        let ratio = childNode.n_wins / childNode.n_plays;
        if (ratio > max) {
          bestPlay = play;
          max = ratio;
        }
      }
    }

    return bestPlay;
  }

  /**
   * Phase 1: Selection
   * Select until EITHER not fully expanded OR leaf node
   * @param {State} state - The root state to start selection from.
   * @return {MonteCarloNode} The selected node.
   */
  select(state: TState) {
    let node = this.nodes.get(state.hash());
    while (node.isFullyExpanded() && !node.isLeaf()) {
      let plays = node.allPlays();
      let bestPlay;
      let bestUCB1 = -Infinity;
      for (let play of plays) {
        let childUCB1 = node.childNode(play).getUCB1(this.UCB1ExploreParam);
        if (childUCB1 > bestUCB1) {
          bestPlay = play;
          bestUCB1 = childUCB1;
        }
      }
      node = node.childNode(bestPlay);
    }
    return node;
  }

  /**
   * Phase 2: Expansion
   * Of the given node, expand a random unexpanded child node
   * @param {MonteCarloNode} node - The node to expand from. Assume not leaf.
   * @return {MonteCarloNode} The new expanded child node.
   */
  expand(node: MonteCarloNode<TState>) {
    let plays = node.unexpandedPlays();
    let index = Math.floor(Math.random() * plays.length);
    let play = plays[index];

    let childState = this.game.nextState(node.state, play);
    let childUnexpandedPlays = this.game.legalPlays(childState);
    let childNode = node.expand(play, childState, childUnexpandedPlays);
    this.nodes.set(childState.hash(), childNode);

    return childNode;
  }

  /**
   * Phase 3: Simulation
   * From given node, play the game until a terminal state, then return winner
   * @param {MonteCarloNode} node - The node to simulate from.
   * @return {number} The winner of the terminal game state.
   */
  simulate(node: MonteCarloNode<TState>) {
    let state = node.state;
    let winner = this.game.winner(state);

    while (winner === null) {
      let plays = this.game.legalPlays(state);
      let play = plays[Math.floor(Math.random() * plays.length)];
      state = this.game.nextState(state, play);
      winner = this.game.winner(state);
    }

    return winner;
  }

  /**
   * Phase 4: Backpropagation
   * From given node, propagate plays and winner to ancestors' statistics
   * @param {MonteCarloNode} node - The node to backpropagate from. Typically leaf.
   * @param {InstanceId} winner - The winner to propagate.
   */
  backpropagate(node: MonteCarloNode<TState>, winner: InstanceId) {
    while (node !== null) {
      node.n_plays += 1;
      // Parent's choice
      if (node.state.isPlayer(winner)) {
        node.n_wins += 1;
      }
      node = node.parent;
    }
  }

  // Utility & debugging methods

  /**
   * Return MCTS statistics for this node and children nodes
   * @param {State} state - The state to get statistics for.
   * @return {Object} The MCTS statistics.
   */
  getStats(state: TState) {
    let node = this.nodes.get(state.hash());
    let stats = { n_plays: node.n_plays, n_wins: node.n_wins, children: [] };
    for (let child of node.children.values()) {
      if (child.node === null)
        stats.children.push({ play: child.play, n_plays: null, n_wins: null });
      else
        stats.children.push({
          play: child.play,
          n_plays: child.node.n_plays,
          n_wins: child.node.n_wins
        });
    }
    return stats;
  }
}

/**
 * Class representing a node in the search tree.
 * Stores tree search stats for UCB1.
 */
class MonteCarloNode<TState extends State> {
  n_plays = 0;
  n_wins = 0;
  children = new Map();

  /**
   * Create a new MonteCarloNode in the search tree.
   * @param {MonteCarloNode} parent - The parent node.
   * @param {Play} play - Last play played to get to this state.
   * @param {State} state - The corresponding state.
   * @param {Play[]} unexpandedPlays - The node's unexpanded child plays.
   */
  constructor(
    public parent: MonteCarloNode<TState>,
    public play: Action,
    public state: TState,
    unexpandedPlays: Action[]
  ) {
    for (let play of unexpandedPlays) {
      this.children.set(play.hash(), { play: play, node: null });
    }
  }

  /**
   * Get the MonteCarloNode corresponding to the given play.
   * @param {number} play - The play leading to the child node.
   * @return {MonteCarloNode} The child node corresponding to the play given.
   */
  childNode(play) {
    let child = this.children.get(play.hash());
    if (child === undefined) {
      throw new Error("No such play!");
    } else if (child.node === null) {
      throw new Error("Child is not expanded!");
    }
    return child.node;
  }

  /**
   * Expand the specified child play and return the new child node.
   * Add the node to the array of children nodes.
   * Remove the play from the array of unexpanded plays.
   * @param {Play} play - The play to expand.
   * @param {State} childState - The child state corresponding to the given play.
   * @param {Play[]} unexpandedPlays - The given child's unexpanded child plays; typically all of them.
   * @return {MonteCarloNode} The new child node.
   */
  expand(play, childState, unexpandedPlays) {
    if (!this.children.has(play.hash())) throw new Error("No such play!");
    let childNode = new MonteCarloNode(this, play, childState, unexpandedPlays);
    this.children.set(play.hash(), { play: play, node: childNode });
    return childNode;
  }

  /**
   * Get all legal plays from this node.
   * @return {Play[]} All plays.
   */
  allPlays() {
    let ret = [];
    for (let child of this.children.values()) {
      ret.push(child.play);
    }
    return ret;
  }

  /**
   * Get all unexpanded legal plays from this node.
   * @return {Play[]} All unexpanded plays.
   */
  unexpandedPlays() {
    let ret = [];
    for (let child of this.children.values()) {
      if (child.node === null) ret.push(child.play);
    }
    return ret;
  }

  /**
   * Whether this node is fully expanded.
   * @return {boolean} Whether this node is fully expanded.
   */
  isFullyExpanded() {
    for (let child of this.children.values()) {
      if (child.node === null) return false;
    }
    return true;
  }

  /**
   * Whether this node is terminal in the game tree, NOT INCLUSIVE of termination due to winning.
   * @return {boolean} Whether this node is a leaf in the tree.
   */
  isLeaf() {
    if (this.children.size === 0) return true;
    else return false;
  }

  /**
   * Get the UCB1 value for this node.
   * @param {number} biasParam - The square of the bias parameter in the UCB1 algorithm, defaults to 2.
   * @return {number} The UCB1 value of this node.
   */
  getUCB1(biasParam) {
    return (
      this.n_wins / this.n_plays +
      Math.sqrt((biasParam * Math.log(this.parent.n_plays)) / this.n_plays)
    );
  }
}
