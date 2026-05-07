import type { Player } from "../lib/types.ts";

export function Square({
  player,
  isHighlighted,
  isXNext,
  isGameOver,
  onClick,
}: {
  player: Player;
  isHighlighted: boolean;
  isXNext: boolean;
  isGameOver: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-highlight={isHighlighted}
      data-preview-next={isXNext ? "X" : "O"}
      onClick={onClick}
      className="square"
      aria-label={player ? `Player ${player}` : "Empty"}
      disabled={player !== null || isGameOver}
    >
      {player}
    </button>
  );
}
