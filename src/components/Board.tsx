import { memo } from "react";
import Cell from "./Cell";
import type { Cell as CellType } from "../types/game";

type Props = {
  board: CellType[];
  onPlay: (i: number) => void;
  winningLine?: [number, number, number] | null;
  disabled?: boolean;
};

function Board({ board, onPlay, winningLine, disabled = false }: Props) {
  return (
    <div
      role="grid"
      aria-label="Tic Tac Toe board"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
      }}
    >
      {board.map((cell, i) => (
        <Cell
          key={i}
          index={i}
          value={cell}
          onPlay={onPlay}
          highlight={winningLine?.includes(i) ?? false}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default memo(Board);
