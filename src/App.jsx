import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const isXNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const winner = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every(Boolean);
  const isGameOver = winner || isDraw;
  const status = winner
    ? `Winner: {winner}`
    : isDraw
      ? "Draw"
      : `Next player: ${isXNext ? "X" : "O"}`;

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  return (
    <div className="game">
      <div className="status">{status}</div>
      <Board
        isXNext={isXNext}
        squares={currentSquares}
        isGameOver={isGameOver}
        onPlay={handlePlay}
      />
      <div className="game-info">
        <ol>
          {history.map((_squares, move) => (
            <li key={move}>
              <button onClick={() => setCurrentMove(move)}>
                {move > 0 ? `Go to move #${move}` : "Go to game start"}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Board({ isXNext, squares, isGameOver, onPlay }) {
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
        <Square value={square} onClick={() => handleSquareClick(i)} />
      ))}
    </div>
  );
}

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}
