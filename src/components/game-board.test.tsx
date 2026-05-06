import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import type { Player } from "../lib/types.ts";
import { GameBoard } from "./game-board.tsx";

test("does not call onPlay event handler when clicked square is filled", async () => {
  const onPlay = vi.fn();
  const history: Player[][] = [Array(9).fill(null)];
  const currentSquares = history[0];
  const screen = await render(
    <GameBoard
      isXNext={true}
      squares={currentSquares}
      winner={null}
      isGameOver={false}
      onPlay={onPlay}
    />,
  );

  const squares = screen.getByRole("region", { name: /board/i }).getByRole("button");

  await expect(squares.nth(0).click()).rejects.toThrow();

  expect(onPlay).toHaveBeenCalledTimes(0);
});

test("does not call onPlay event handler when game is ower", async () => {
  const onPlay = vi.fn();
  const screen = await render(
    <GameBoard
      isXNext={false}
      squares={["X", "O", null, null, "X", "O", null, null, "X"]}
      winner={{ player: "X", line: [0, 4, 8] }}
      isGameOver={true}
      onPlay={onPlay}
    />,
  );

  const squares = screen.getByRole("region", { name: /board/i }).getByRole("button");

  await expect(squares.nth(2).click()).rejects.toThrow();

  expect(onPlay).toHaveBeenCalledTimes(0);
});
