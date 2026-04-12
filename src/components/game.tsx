import { useState } from "react";

import type { Player } from "../lib/types.ts";
import { calculateWinner } from "../lib/utils.ts";
import { FilterableGameHistory } from "./filterable-game-history.tsx";
import { GameBoard } from "./game-board.tsx";
import { GameStatus } from "./game-status.tsx";
import { ResetGameButton } from "./reset-game-button.tsx";

export function Game() {
  const [history, setHistory] = useState<Player[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const isXNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const winner = calculateWinner(currentSquares);
  const isDraw = !winner && currentSquares.every(Boolean);
  const isGameOver = Boolean(winner || isDraw);

  const handlePlay = (nextSquares: Player[]) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  };

  return (
    <div className="game">
      <GameStatus isXNext={isXNext} winner={winner} isDraw={isDraw} />
      {isGameOver ? <ResetGameButton onReset={resetGame} /> : null}
      <GameBoard
        isXNext={isXNext}
        squares={currentSquares}
        winner={winner}
        isGameOver={isGameOver}
        onPlay={handlePlay}
      />
      <FilterableGameHistory history={history} currentMove={currentMove} onMove={setCurrentMove} />
    </div>
  );
}
