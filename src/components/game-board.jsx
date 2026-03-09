import { Square } from "./square";

export function GameBoard({ isXNext, squares, winner, isGameOver, onPlay }) {
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
        <Square
          key={i}
          value={square}
          isHighlighted={winner?.line.includes(i) ?? false}
          onClick={() => handleSquareClick(i)}
        />
      ))}
    </div>
  );
}
