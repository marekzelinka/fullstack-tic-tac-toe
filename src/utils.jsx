export function calculateWinner(squares) {
  const lines = [
    // Winning row lines
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Winning column lines
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Winning diagonal lines
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }

  return null;
}
