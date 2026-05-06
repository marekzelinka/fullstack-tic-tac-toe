import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Game } from "./game.tsx";

test("full game flow: X wins and resets", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("region", { name: /board/i }).getByRole("button");

  await expect.element(screen.getByText("Next player: X")).toBeVisible();

  // Simplate a winning game for player X
  await squares.nth(0).click(); // X
  await squares.nth(1).click(); // O
  await squares.nth(4).click(); // X
  await squares.nth(5).click(); // O
  await squares.nth(8).click(); // X (X wins diagonal)

  await expect.element(screen.getByText("Winner: X")).toBeVisible();
  const winningIndicesAreHightlighted = [0, 4, 8].map((index) =>
    expect.element(squares.nth(index)).toHaveAttribute("data-highlight", "true"),
  );
  await Promise.all(winningIndicesAreHightlighted);

  // Reset the game
  await screen.getByRole("button", { name: /play again/i }).click();

  // Verify game state
  await expect.element(screen.getByText("Next player: X")).toBeVisible();
  await expect.element(squares.nth(0)).toHaveTextContent("");
});

test("time travel: clicking history button updates the board", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("region", { name: /board/i }).getByRole("button");

  await squares.nth(0).click(); // Move 1 (X)
  await squares.nth(1).click(); // Move 2 (O)
  // Go back to move #1
  await screen.getByRole("button", { name: /go to move #1/i }).click();

  await expect.element(screen.getByText("You are at move #1")).toBeVisible();
  await expect.element(squares.nth(0)).toHaveTextContent("X");
  await expect.element(squares.nth(1)).toHaveTextContent(""); // O should be gone
});

test("game ends in a draw", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("region", { name: /board/i }).getByRole("button");

  for (const move of [0, 1, 2, 4, 3, 5, 7, 6, 8]) {
    // We cannot use Promise.all here because the game depends on the
    // previous move being finished
    // oxlint-disable-next-line no-await-in-loop
    await squares.nth(move).click();
  }

  await expect.element(screen.getByText("Draw")).toBeVisible();
  await expect.element(screen.getByRole("button", { name: /play again/i })).toBeVisible();
  await expect.element(screen.getByText("Winner: X")).not.toBeInTheDocument();
});

test("history list can be sorted ascending and descending", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("region", { name: /board/i }).getByRole("button");

  await squares.nth(0).click();
  await squares.nth(1).click();

  const historyItems = screen.getByRole("listitem");

  await expect.element(historyItems.nth(0)).toHaveTextContent("Go to game start");
  await expect.element(historyItems.nth(2)).toHaveTextContent("You are at move #2");

  await screen.getByRole("button", { name: /sort moves descending/i }).click();

  await expect.element(historyItems.nth(2)).toHaveTextContent("Go to game start");
  await expect.element(historyItems.nth(0)).toHaveTextContent("You are at move #2");
});

test("sorting button has correct accessibility attributes", async () => {
  const screen = await render(<Game />);

  const sortDescendingBtn = screen.getByRole("button", { name: /sort moves descending/i });
  await expect.element(sortDescendingBtn).toHaveAttribute("aria-pressed", "false");
  await sortDescendingBtn.click();

  const sortAscendingBtn = screen.getByRole("button", { name: /sort moves ascending/i });
  await expect.element(sortAscendingBtn).toHaveAttribute("aria-pressed", "true");
});

test("square preview updates correctly after each turn", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("region", { name: /board/i }).getByRole("button");

  // Initially the first square should preview "X"
  await expect.element(squares.nth(0)).toHaveAttribute("data-preview-next", "X");

  await squares.nth(0).click();

  await expect.element(squares.nth(1)).toHaveAttribute("data-preview-next", "O");

  await squares.nth(1).click();

  // Simulate next turn, next square should preview "X"
  await expect.element(squares.nth(2)).toHaveAttribute("data-preview-next", "X");
});

test("square preview is consistent across all empty squares", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("region", { name: /board/i }).getByRole("button");

  const allSquaresHavePreview = Array.from({ length: 9 }, (_, i) => i).map((index) =>
    expect.element(squares.nth(index)).toHaveAttribute("data-preview-next", "X"),
  );
  await Promise.all(allSquaresHavePreview);
});

test("squares are unclickable and disabled after a win", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("region", { name: /board/i }).getByRole("button");

  await squares.nth(0).click(); // X
  await squares.nth(3).click(); // O
  await squares.nth(1).click(); // X
  await squares.nth(4).click(); // O
  await squares.nth(2).click(); // X - Game Over

  await expect.element(screen.getByText("Winner: X")).toBeVisible();

  const allSquaresAreDisabled = Array.from({ length: 9 }, (_, i) => i).map((index) =>
    expect.element(squares.nth(index)).toHaveAttribute("aria-disabled", "true"),
  );
  await Promise.all(allSquaresAreDisabled);
  const emptySquare = squares.nth(5);

  await expect(emptySquare.click()).rejects.toThrow();
  await expect.element(emptySquare).toHaveTextContent("");
  await expect.element(screen.getByText("Winner: X")).toBeVisible();
});

test("square is unclickable after filled", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("region", { name: /board/i }).getByRole("button");

  await squares.nth(0).click(); // X

  await expect(squares.nth(0).click()).rejects.toThrow();
  await expect.element(squares.nth(0)).toHaveAttribute("aria-disabled", "true");
});
