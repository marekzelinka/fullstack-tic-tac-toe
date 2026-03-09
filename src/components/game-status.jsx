export function GameStatus({ isXNext, winner, isDraw }) {
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
