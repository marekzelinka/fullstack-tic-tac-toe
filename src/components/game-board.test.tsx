import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import type { Player } from "../lib/types.ts";
import { GameBoard } from "./game-board.tsx";

test("does not call onPlay event handler when clicked square is filled", async () => {
  const onPlay = vi.fn();
  const screen = await render(
    <GameBoard
      isXNext={true}
      squares={["X" as Player].concat(Array(8).fill(null))}
      winner={null}
      isGameOver={false}
      onPlay={onPlay}
    />,
  );
  const filledSquare = screen.getByRole("button", { name: /player x/i }).first();

  await expect.element(filledSquare).toBeDisabled();

  expect(onPlay).toHaveBeenCalledTimes(0);
});

test("does not call onPlay event handler when game is ower", async () => {
  const onPlay = vi.fn();
  const screen = await render(
    <GameBoard
      isXNext={false}
      squares={["X", "O", null, null, "X", "O", null, null, "X"]} // Winner: X
      winner={{ player: "X", line: [0, 4, 8] }}
      isGameOver={true}
      onPlay={onPlay}
    />,
  );
  const emptySquare = screen.getByRole("button", { name: /empty/i }).first();

  await expect.element(emptySquare).toBeDisabled();

  expect(onPlay).toHaveBeenCalledTimes(0);
});
