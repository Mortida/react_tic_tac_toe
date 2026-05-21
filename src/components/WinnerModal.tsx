import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useRef, useState } from "react";

interface WinnerModalProps {
  /** Pass winner name to show victory modal, or "Draw!" for a draw. Pass null to hide. */
  winner: string | null;
  onClose: () => void;
}

const CONFETTI_DURATION_MS = 5_000;

export default function WinnerModal({ winner, onClose }: WinnerModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isDraw = winner === "Draw!";

  // Start/stop confetti when a winner is announced
  useEffect(() => {
    if (!winner || isDraw) {
      setShowConfetti(false);
      return;
    }
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), CONFETTI_DURATION_MS);
    return () => clearTimeout(timer);
  }, [winner, isDraw]);

  // Focus the close button when modal opens (accessibility)
  useEffect(() => {
    if (winner) closeButtonRef.current?.focus();
  }, [winner]);

  // Close on Escape key
  useEffect(() => {
    if (!winner) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [winner, onClose]);

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      <AnimatePresence>
        {winner && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={isDraw ? "Game ended in a draw" : `${winner} wins!`}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
            onClick={onClose}
          >
            <motion.div
              key="card"
              initial={{ y: -50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              style={{
                background: "white",
                padding: "40px",
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                maxWidth: "300px",
                width: "90%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.h2
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                style={{ fontSize: "2rem", marginBottom: "8px", color: isDraw ? "#f59e0b" : "#22c55e" }}
              >
                {isDraw ? "🤝 Draw!" : "🎉 Winner! 🎉"}
              </motion.h2>

              {!isDraw && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "20px" }}
                >
                  {winner}
                </motion.p>
              )}

              <motion.button
                ref={closeButtonRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                style={{
                  marginTop: "20px",
                  padding: "10px 28px",
                  border: "none",
                  borderRadius: "10px",
                  background: isDraw ? "#f59e0b" : "#22c55e",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
                onClick={onClose}
              >
                Continue
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
