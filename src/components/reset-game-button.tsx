export function ResetGameButton({ onReset }: { onReset: () => void }) {
  return (
    <button type="button" className="reset-button" onClick={onReset}>
      Play Again
    </button>
  );
}
