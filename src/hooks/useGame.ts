import { useCallback, useMemo, useReducer } from "react";
import type { Cell, Score } from "../types/game";
import { getWinner } from "../logic/game";

const EMPTY_BOARD = Object.freeze(Array(9).fill(null)) as Cell[];

type GameState = {
  board: Cell[];
  xTurn: boolean;
  score: Score;
  winningLine: [number, number, number] | null;
};

type GameAction =
  | { type: "play"; index: number }
  | { type: "reset" }
  | { type: "resetAll" };

const initialState: GameState = {
  board: [...EMPTY_BOARD],
  xTurn: true,
  score: { X: 0, O: 0, D: 0 },
  winningLine: null,
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "play": {
      const { index } = action;
      // Guard: cell already occupied or game already over
      if (state.board[index] || state.winningLine) return state;

      const nextBoard = [...state.board] as Cell[];
      nextBoard[index] = state.xTurn ? "X" : "O";

      const result = getWinner(nextBoard);
      const draw = !result && nextBoard.every(Boolean);

      if (result) {
        return {
          board: nextBoard,
          xTurn: state.xTurn,
          winningLine: result.line,
          score: {
            ...state.score,
            [result.winner as string]: state.score[result.winner as "X" | "O"] + 1,
          },
        };
      }

      if (draw) {
        return {
          board: nextBoard,
          xTurn: state.xTurn,
          winningLine: null,
          score: { ...state.score, D: state.score.D + 1 },
        };
      }

      return {
        board: nextBoard,
        xTurn: !state.xTurn,
        winningLine: null,
        score: state.score,
      };
    }
    case "reset":
      return { ...state, board: [...EMPTY_BOARD], xTurn: true, winningLine: null };
    case "resetAll":
      return { ...initialState, board: [...EMPTY_BOARD] };
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const play = useCallback((index: number) => dispatch({ type: "play", index }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);
  const resetAll = useCallback(() => dispatch({ type: "resetAll" }), []);

  return useMemo(
    () => ({
      board: state.board,
      xTurn: state.xTurn,
      score: state.score,
      winningLine: state.winningLine,
      play,
      reset,
      resetAll,
    }),
    [state.board, state.xTurn, state.score, state.winningLine, play, reset, resetAll],
  );
}
