import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Game } from "./game.tsx";

test("full game flow: X wins and resets", async () => {
  const screen = await render(<Game />);

  await expect.element(screen.getByText(/Next player: X/i)).toBeVisible();

  const squares = screen.getByRole("button", { name: /player|empty/i }).all();

  // Simplate a winning game for player X
  await squares[0].click(); // X
  await squares[1].click(); // O
  await squares[4].click(); // X
  await squares[5].click(); // O
  await squares[8].click(); // X (X wins diagonal)

  await expect.element(screen.getByText(/Winner: X/i)).toBeVisible();
  // Verifiy winning squares
  await expect.element(squares[0]).toHaveAttribute("data-highlight", "true");
  await expect.element(squares[4]).toHaveAttribute("data-highlight", "true");
  await expect.element(squares[8]).toHaveAttribute("data-highlight", "true");

  // Reset the game
  await screen.getByRole("button", { name: "play again" }).click();

  // Verify game state
  await expect.element(screen.getByText(/Next player: X/i)).toBeVisible();
  await expect.element(squares[0]).toHaveTextContent("");
});

test("time travel: clicking history button updates the board", async () => {
  const screen = await render(<Game />);

  const squares = screen.getByRole("button", { name: /player|empty/i }).all();

  await squares[0].click(); // Move 1 (X)
  await squares[1].click(); // Move 2 (O)

  // Go back to move #1
  await screen.getByRole("button", { name: /go to move #1/i }).click();

  await expect.element(screen.getByText(/you are at move #1/i)).toBeVisible();
  await expect.element(squares[0]).toHaveTextContent("X");
  await expect.element(squares[1]).toHaveTextContent(""); // O should be gone
});

test("game ends in a draw", async () => {
  const screen = await render(<Game />);

  const squares = screen.getByRole("button", { name: /player|empty/i }).all();

  // Simulate all squares filled without a winner
  const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
  for (const index of moves) {
    await squares[index].click();
  }

  await expect.element(screen.getByText(/^Draw$/)).toBeVisible();
  await expect.element(screen.getByRole("button", { name: /play again/i })).toBeVisible();
  await expect.element(screen.getByText(/Winner:/)).not.toBeInTheDocument();
});

test("history list can be sorted ascending and descending", async () => {
  const screen = await render(<Game />);

  const squares = screen.getByRole("button", { name: /player|empty/i }).all();

  await squares[0].click();
  await squares[1].click();

  const history = () =>
    screen
      .getByRole("listitem")
      .all()
      .map((li) => li.element().textContent);

  expect(history()[0]).toContain("Go to game start");
  expect(history()[2]).toContain("You are at move #2");

  await screen.getByRole("button", { name: /sort moves descending/i }).click();

  expect(history()[2]).toContain("Go to game start");
  expect(history()[0]).toContain("You are at move #2");
});

test("sorting button has correct accessibility attributes", async () => {
  const screen = await render(<Game />);

  let sortBtn = screen.getByRole("button", { name: /sort moves descending/i });
  await expect.element(sortBtn).toHaveAttribute("aria-pressed", "false");
  await sortBtn.click();

  await expect
    .element(screen.getByRole("button", { name: /sort moves ascending/i }))
    .toHaveAttribute("aria-pressed", "true");
});

test("square preview updates correctly after each turn", async () => {
  const screen = await render(<Game />);

  const squares = () => screen.getByRole("button", { name: /player|empty/i }).all();
  let currentSquares = squares();

  // Initially the first square should preview "X"
  await expect.element(currentSquares[0]).toHaveAttribute("data-preview-next", "X");
  await currentSquares[0].click();

  // Simulate next turn, next square should preview "O"
  currentSquares = squares();
  await expect.element(currentSquares[1]).toHaveAttribute("data-preview-next", "O");
  await currentSquares[1].click();

  // Simulate next turn, next square should preview "X"
  currentSquares = squares();
  await expect.element(currentSquares[2]).toHaveAttribute("data-preview-next", "X");
});

test("square preview is consistent across all empty squares", async () => {
  const screen = await render(<Game />);

  const squares = screen.getByRole("button", { name: /player|empty/i }).all();

  for (const square of squares) {
    await expect.element(square).toHaveAttribute("data-preview-next", "X");
  }
});
