export function ResetGameButton({ onReset }: { onReset: () => void }) {
  return (
    <button className="reset-button" onClick={onReset}>
      Play Again
    </button>
  );
}
