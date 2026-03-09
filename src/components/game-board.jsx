import { calculateWinner } from "../utils";
import { Square } from "./square";

export function GameBoard({ isXNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);
  const isGameOver = winner || isDraw;

  const handleSquareClick = (i) => {
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
        <Square key={i} value={square} onClick={() => handleSquareClick(i)} />
      ))}
    </div>
  );
}
