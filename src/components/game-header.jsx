export function GameHeader({ isXNext, winner, isDraw, isGameOver, onReset }) {
  return (
    <div className="game-header">
      <GameStatus isXNext={isXNext} winner={winner} isDraw={isDraw} />
      <GameActions isGameOver={isGameOver} onReset={onReset} />
    </div>
  );
}

function GameStatus({ isXNext, winner, isDraw }) {
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

function GameActions({ isGameOver, onReset }) {
  return (
    <div className="game-actions">
      {isGameOver ? <button onClick={onReset}>Play Again</button> : null}
    </div>
  );
}
