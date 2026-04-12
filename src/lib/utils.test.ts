import { describe, expect, test } from "vitest";

import type { Player } from "./types";
import { calculateWinner } from "./utils";

describe("calculateWinner", () => {
  test("returns null for an empty board", () => {
    const squares: Player[] = Array(9).fill(null);
    expect(calculateWinner(squares)).toBeNull();
  });

  test("identifies a winning row (top row)", () => {
    const squares: Player[] = ["X", "X", "X", "O", null, "O", null, null, null];
    expect(calculateWinner(squares)).toStrictEqual({
      player: "X",
      line: [0, 1, 2],
    });
  });

  test("identifies a winning column (middle column)", () => {
    const squares: Player[] = ["X", "O", null, null, "O", "X", "X", "O", null];
    expect(calculateWinner(squares)).toStrictEqual({
      player: "O",
      line: [1, 4, 7],
    });
  });

  test("identifies a winning diagonal (top right to bottom left", () => {
    const squares: Player[] = ["X", "O", "O", null, "X", null, null, null, "X"];
    expect(calculateWinner(squares)).toStrictEqual({
      player: "X",
      line: [0, 4, 8],
    });
  });

  test("returns null on a draw", () => {
    const squares: Player[] = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
    expect(calculateWinner(squares)).toBeNull();
  });

  test("returns null if there are 3 in a line but one is null", () => {
    const squares: Player[] = [null, null, null, "X", "X", null, null, null, null];
    expect(calculateWinner(squares)).toBeNull();
  });
});
