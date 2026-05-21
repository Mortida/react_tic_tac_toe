import { useCallback, useEffect, useMemo, useState } from "react";
import Board from "../components/Board";
import ScoreBoard from "../components/ScoreBoard";
import SettingsPanel from "../components/SettingsPanel";
import WinnerModal from "../components/WinnerModal";

import { useGame } from "../hooks/useGame";
import { useSettings } from "../hooks/useSettings";
import { useAudio } from "../hooks/useAudio";
import { bestMove } from "../logic/minimax";
import { themes } from "../styles/theme";
import type { Mode } from "../types/game";

export default function App() {
  const game = useGame();
  const settings = useSettings();
  const audio = useAudio(settings.settings);
  const [mode, setMode] = useState<Mode>("ai");
  const [modalContent, setModalContent] = useState<string | null>(null);

  const theme = themes[settings.settings.theme];

  // Derive winner name from game state (winningLine signals a winner)
  const winnerName = useMemo(() => {
    if (!game.winningLine) return null;
    const winnerCell = game.board[game.winningLine[0]];
    if (mode === "ai") return winnerCell === "X" ? "Player" : "AI";
    return winnerCell;
  }, [game.winningLine, game.board, mode]);

  // Derive draw from board being full with no winner
  const isDraw = useMemo(
    () => !game.winningLine && game.board.every(Boolean),
    [game.winningLine, game.board],
  );

  const isGameOver = Boolean(winnerName || isDraw);

  // Sound + modal on game over
  useEffect(() => {
    if (winnerName) {
      audio.win();
      setModalContent(winnerName);
    } else if (isDraw) {
      audio.draw();
      setModalContent("Draw!");
    }
  }, [winnerName, isDraw]); // eslint-disable-line react-hooks/exhaustive-deps
  // ^ audio is intentionally omitted: it is a derived memo, not state,
  //   and would cause double-firing in StrictMode if included.

  // AI move
  useEffect(() => {
    if (mode !== "ai" || game.xTurn || isGameOver) return;

    const timer = window.setTimeout(() => {
      const move = bestMove(game.board);
      audio.click("O");
      game.play(move);
    }, 400);

    return () => window.clearTimeout(timer);
  }, [mode, game.board, game.xTurn, isGameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlay = useCallback(
    (i: number) => {
      if (isGameOver) return;
      if (mode === "ai" && !game.xTurn) return;
      audio.click(game.xTurn ? "X" : "O");
      game.play(i);
    },
    [isGameOver, mode, game, audio],
  );

  const handleNewRound = useCallback(() => {
    audio.round();
    game.reset();
  }, [audio, game]);

  const handleResetAll = useCallback(() => {
    audio.reset();
    game.resetAll();
  }, [audio, game]);

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      setMode(newMode);
      game.reset();
    },
    [game],
  );

  const status = winnerName
    ? `Winner: ${winnerName}`
    : isDraw
      ? "Draw!"
      : `Turn: ${game.xTurn ? "X" : "O"}`;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 340,
          padding: 18,
          borderRadius: 22,
          background: theme.card,
          color: theme.text,
          boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ color: theme.text, textAlign: "center", margin: "0 0 16px" }}>
          Tic Tac Toe Pro
        </h1>

        {/* Mode selector */}
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {(["ai", "pvp"] as Mode[]).map((m) => (
            <button
              key={m}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                color: "white",
                background: mode === m ? "#22c55e" : "#334155",
              }}
              onClick={() => handleModeChange(m)}
            >
              {m === "ai" ? "Vs AI" : "2 Players"}
            </button>
          ))}
        </div>

        <p
          role="status"
          aria-live="polite"
          style={{ textAlign: "center", fontWeight: "bold", marginBottom: 12, color: theme.text }}
        >
          {status}
        </p>

        <ScoreBoard score={game.score} color={theme.text} />

        <Board
          board={game.board}
          onPlay={handlePlay}
          winningLine={game.winningLine}
          disabled={isGameOver || (mode === "ai" && !game.xTurn)}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 14, marginBottom: 12 }}>
          <button
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "#334155",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={handleNewRound}
          >
            New Round
          </button>

          <button
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background: "#334155",
              color: "white",
              fontWeight: "bold",
            }}
            onClick={handleResetAll}
          >
            Reset Scores
          </button>
        </div>

        <SettingsPanel settings={settings.settings} update={settings.update} />
      </div>

      <WinnerModal
        winner={modalContent}
        onClose={() => setModalContent(null)}
      />
    </div>
  );
}
