import type { Player } from "../types.ts";

export function Square({
  value,
  isHighlighted,
  onClick,
}: {
  value: Player;
  isHighlighted: boolean;
  onClick: () => void;
}) {
  return (
    <button data-highlight={isHighlighted} className="square" onClick={onClick}>
      {value}
    </button>
  );
}
