import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const isXNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handlePlay = (nextSquares) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  return (
    <div className="game">
      <GameStatus isXNext={isXNext} squares={currentSquares} />
      <GameBoard
        isXNext={isXNext}
        squares={currentSquares}
        onPlay={handlePlay}
      />
      <GameHistory
        history={history}
        currentMove={currentMove}
        onMove={setCurrentMove}
      />
    </div>
  );
}

function GameStatus({ isXNext, squares }) {
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

function GameBoard({ isXNext, squares, onPlay }) {
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

function Square({ value, onClick }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function GameHistory({ history, currentMove, onMove }) {
  return (
    <ol className="game-history">
      {history.map((_squares, move) => (
        <li key={move}>
          {move === currentMove ? (
            `You are at move #${move}`
          ) : (
            <button onClick={() => onMove(move)}>
              {move > 0 ? `Go to move #${move}` : "Go to game start"}
            </button>
          )}
        </li>
      ))}
    </ol>
  );
}

function calculateWinner(squares) {
  const lines = [
    // Winning row lines
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Winning column lines
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Winning diagonal lines
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }

  return null;
}
