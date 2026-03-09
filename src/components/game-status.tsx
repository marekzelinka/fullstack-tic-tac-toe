import type { Winner } from "../types.ts";

export function GameStatus({
  isXNext,
  winner,
  isDraw,
}: {
  isXNext: boolean;
  winner: Winner;
  isDraw: boolean;
}) {
  return (
    <div className="game-status">
      {winner
        ? `Winner: ${winner.player}`
        : isDraw
          ? "Draw"
          : `Next player: ${isXNext ? "X" : "O"}`}
    </div>
  );
}
