import type { Player } from "../types.ts";

export function Square({
  value,
  isHighlighted,
  isXNext,
  isGameOver,
  onClick,
}: {
  value: Player;
  isHighlighted: boolean;
  isXNext: boolean;
  isGameOver: boolean;
  onClick: () => void;
}) {
  return (
    <button
      data-highlight={isHighlighted}
      data-preview-next={isXNext ? "X" : "O"}
      onClick={onClick}
      className="square"
      aria-disabled={value || isGameOver ? "true" : undefined}
    >
      {value}
    </button>
  );
}
