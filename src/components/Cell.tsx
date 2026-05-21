import { memo } from "react";

type Props = {
  value: "X" | "O" | null;
  index: number;
  onPlay: (index: number) => void;
  highlight?: boolean;
  disabled?: boolean;
};

function Cell({ value, index, onPlay, highlight = false, disabled = false }: Props) {
  const isEmpty = value === null;
  const isDisabled = disabled || !isEmpty;

  const label = value
    ? `Cell ${index + 1}: ${value}`
    : `Cell ${index + 1}: empty`;

  return (
    <button
      aria-label={label}
      disabled={isDisabled}
      onClick={() => onPlay(index)}
      style={{
        height: 90,
        fontSize: 32,
        fontWeight: "bold",
        borderRadius: 12,
        border: "none",
        cursor: isDisabled ? "not-allowed" : "pointer",
        background: highlight ? "#22c55e" : "#e2e8f0",
        color: value === "X" ? "#2563eb" : "#ef4444",
        transition: "background 0.2s, transform 0.1s",
        transform: highlight ? "scale(1.05)" : "scale(1)",
        opacity: isDisabled && !highlight ? 0.85 : 1,
      }}
    >
      {value}
    </button>
  );
}

export default memo(Cell);
