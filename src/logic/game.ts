import type { Cell } from "../types/game";

export const WIN_LINES: readonly [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

/**
 * Returns the winning cell value AND the winning line indices, or null if no winner.
 */
export function getWinner(board: Cell[]): { winner: Cell; line: [number, number, number] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

export function isDraw(board: Cell[], winResult: ReturnType<typeof getWinner>): boolean {
  return !winResult && board.every(Boolean);
}
