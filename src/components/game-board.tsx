import type { Player, Winner } from "../types.ts";
import { Square } from "./square.tsx";

export function GameBoard({
  isXNext,
  squares,
  winner,
  isGameOver,
  onPlay,
}: {
  isXNext: boolean;
  squares: Player[];
  winner: Winner;
  isGameOver: boolean;
  onPlay: (nextSquares: Player[]) => void;
}) {
  const handleSquareClick = (i: number) => {
    if (squares[i] || isGameOver) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = isXNext ? "X" : "O";
    onPlay(nextSquares);
  };

  return (
    <div className="game-board">
      {squares.map((square, i) => (
        <Square
          key={i}
          value={square}
          isHighlighted={winner?.line.includes(i) ?? false}
          isXNext={isXNext}
          onClick={() => handleSquareClick(i)}
        />
      ))}
    </div>
  );
}
