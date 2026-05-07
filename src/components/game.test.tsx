import { expect, test } from "vitest";
import { render } from "vitest-browser-react";

import { Game } from "./game.tsx";

test("full game flow: X wins and resets", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("button", { name: /empty|player/i });

  await expect.element(screen.getByText("Next player: X")).toBeVisible();

  await squares.nth(0).click(); // X
  await squares.nth(1).click(); // O
  await squares.nth(4).click(); // X
  await squares.nth(5).click(); // O
  await squares.nth(8).click(); // X (X wins diagonal)

  await expect.element(screen.getByText("Winner: X")).toBeVisible();

  for (const index of [0, 4, 8]) {
    // oxlint-disable-next-line no-await-in-loop
    await expect.element(squares.nth(index)).toHaveAttribute("data-highlight", "true");
  }

  // Reset the game
  await screen.getByRole("button", { name: /play again/i }).click();

  // Verify game state
  await expect.element(screen.getByText("Next player: X")).toBeVisible();
  await expect.element(squares.nth(0)).toHaveTextContent("");
});

test("time travel: clicking history button updates the board", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("button", { name: /empty|player/i });
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
  const squares = screen.getByRole("button", { name: /empty|player/i });

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

test("history is by default in ascending order", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("button", { name: /empty|player/i });
  await squares.nth(0).click();
  await squares.nth(1).click();
  const items = screen.getByRole("list", { name: /history/i }).getByRole("listitem");

  await expect.element(items.first()).toHaveTextContent("Go to game start");
  await expect.element(items.last()).toHaveTextContent("You are at move #2");
});

test("history is correctly sorted when in deascending order", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("button", { name: /empty|player/i });
  await squares.nth(0).click();
  await squares.nth(1).click();
  const items = screen.getByRole("list", { name: /history/i }).getByRole("listitem");

  await screen.getByRole("button", { name: /sort moves descending/i }).click();

  await expect.element(items.last()).toHaveTextContent("Go to game start");
  await expect.element(items.first()).toHaveTextContent("You are at move #2");
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
  const squares = screen.getByRole("button", { name: /empty|player/i });

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
  const squares = screen.getByRole("button", { name: /empty|player/i });

  const allHavePreview = squares
    .all()
    .map((square) => expect.element(square).toHaveAttribute("data-preview-next", "X"));
  await Promise.all(allHavePreview);
});

test("squares are disabled after a win", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("button", { name: /empty|player/i });
  await squares.nth(0).click(); // X
  await squares.nth(3).click(); // O
  await squares.nth(1).click(); // X
  await squares.nth(4).click(); // O
  await squares.nth(2).click(); // X - Game Over
  await expect.element(screen.getByText("Winner: X")).toBeVisible();

  const allDisabled = squares.all().map((square) => expect.element(square).toBeDisabled());
  await Promise.all(allDisabled);

  const emptySquare = squares.nth(5);
  await expect.element(emptySquare).toHaveTextContent("");
  await expect.element(screen.getByText("Winner: X")).toBeVisible();
});

test("square is unclickable after filled", async () => {
  const screen = await render(<Game />);
  const squares = screen.getByRole("button", { name: /empty|player/i });
  const firstSquare = squares.first();

  await firstSquare.click(); // X

  await expect.element(firstSquare).toBeDisabled();
});
