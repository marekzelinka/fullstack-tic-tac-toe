import { useState } from "react";
import { GameStatus } from "./components/game-status";
import { GameBoard } from "./components/game-board";
import { FilterableGameHistory } from "./components/filterable-game-history";

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
      <FilterableGameHistory
        history={history}
        currentMove={currentMove}
        onMove={setCurrentMove}
      />
    </div>
  );
}
