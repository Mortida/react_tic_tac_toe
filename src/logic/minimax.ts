import type { Cell } from "../types/game";
import { getWinner } from "./game";

// NOTE: This cache is intentionally module-level so it persists across games.
// Tic-tac-toe has a finite, small state space (~5,478 unique positions) so
// this is safe and avoids recomputing known positions.
const cache = new Map<string, number>();

function serialize(board: Cell[], isMax: boolean): string {
  return board.map((cell) => cell ?? "_").join("") + (isMax ? "1" : "0");
}

function availableMoves(board: Cell[]): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) moves.push(i);
  }
  return moves;
}

function minimax(
  board: Cell[],
  isMax: boolean,
  alpha = -Infinity,
  beta = Infinity,
): number {
  const key = serialize(board, isMax);
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const result = getWinner(board);
  if (result?.winner === "O") return 10;
  if (result?.winner === "X") return -10;
  if (board.every(Boolean)) return 0;

  const moves = availableMoves(board);
  let bestScore = isMax ? -Infinity : Infinity;

  for (const i of moves) {
    const copy = [...board] as Cell[];
    copy[i] = isMax ? "O" : "X";

    const score = minimax(copy, !isMax, alpha, beta);

    if (isMax) {
      if (score > bestScore) bestScore = score;
      if (bestScore > alpha) alpha = bestScore;
    } else {
      if (score < bestScore) bestScore = score;
      if (bestScore < beta) beta = bestScore;
    }

    if (beta <= alpha) break; // α-β pruning
  }

  cache.set(key, bestScore);
  return bestScore;
}

/**
 * Returns the index of the best move for the AI ("O").
 * Throws if called on a board with no available moves.
 */
export function bestMove(board: Cell[]): number {
  const moves = availableMoves(board);
  if (moves.length === 0) throw new Error("bestMove called on a full board");

  let bestScore = -Infinity;
  let bestIndex = moves[0];

  for (const i of moves) {
    const copy = [...board] as Cell[];
    copy[i] = "O";

    const score = minimax(copy, false, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return bestIndex;
}
