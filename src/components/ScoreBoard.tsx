import { memo } from "react";
import type { Score } from "../types/game";

type Props = {
  score: Score;
  color?: string;
};

function ScoreBoard({ score, color = "white" }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Scores — X: ${score.X}, O: ${score.O}, Draws: ${score.D}`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 10,
        color,
      }}
    >
      <span>X: {score.X}</span>
      <span>O: {score.O}</span>
      <span>Draws: {score.D}</span>
    </div>
  );
}

export default memo(ScoreBoard);
