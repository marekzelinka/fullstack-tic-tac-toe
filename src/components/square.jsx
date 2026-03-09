export function Square({ value, isHighlighted, onClick }) {
  return (
    <button data-highlight={isHighlighted} className="square" onClick={onClick}>
      {value}
    </button>
  );
}
