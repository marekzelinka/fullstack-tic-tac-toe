import { useState } from "react";

export function FilterableGameHistory({ history, currentMove, onMove }) {
  const [isAscending, setIsAscending] = useState(false);

  return (
    <div className="game-history">
      <FilterBar
        isAscending={isAscending}
        onIsAscendingClick={() => setIsAscending(!isAscending)}
      />
      <GameHistory
        history={history}
        isAscending={isAscending}
        currentMove={currentMove}
        onMove={onMove}
      />
    </div>
  );
}

function FilterBar({ isAscending, onIsAscendingClick }) {
  return (
    <div>
      <button onClick={onIsAscendingClick}>
        Sort: {isAscending ? "Ascending" : "Descending"}
      </button>
    </div>
  );
}

function GameHistory({ history, isAscending, currentMove, onMove }) {
  const moves = history.map((_squares, move) => (
    <li key={move}>
      {move === currentMove ? (
        `You are at move #${move}`
      ) : (
        <button onClick={() => onMove(move)}>
          {move > 0 ? `Go to move #${move}` : "Go to game start"}
        </button>
      )}
    </li>
  ));

  return <ol>{isAscending ? moves.toReversed() : moves}</ol>;
}
