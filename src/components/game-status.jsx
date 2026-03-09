import { calculateWinner } from "../utils";

export function GameStatus({ isXNext, squares }) {
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  return (
    <div className="status">
      {winner
        ? `Winner: ${winner}`
        : isDraw
          ? "Draw"
          : `Next player: ${isXNext ? "X" : "O"}`}
    </div>
  );
}
