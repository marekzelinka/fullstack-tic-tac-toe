import type { Player, Winner } from "../lib/types.ts";
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
    <div role="region" className="game-board" aria-label="Tic Tac Toe Board">
      {squares.map((square, i) => (
        <Square
          key={i}
          player={square}
          isHighlighted={winner?.line.includes(i) ?? false}
          isXNext={isXNext}
          isGameOver={isGameOver}
          onClick={() => handleSquareClick(i)}
        />
      ))}
    </div>
  );
}
