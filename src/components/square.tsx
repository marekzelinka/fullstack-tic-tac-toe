import type { Player } from "../types.ts";

export function Square({
  value,
  isHighlighted,
  isXNext,
  onClick,
}: {
  value: Player;
  isHighlighted: boolean;
  isXNext: boolean;
  onClick: () => void;
}) {
  return (
    <button
      data-highlight={isHighlighted}
      data-preview-next={isXNext ? "X" : "O"}
      className="square"
      onClick={onClick}
    >
      {value}
    </button>
  );
}
