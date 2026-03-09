export type Player = "X" | "O" | null;

export type Winner = {
  player: NonNullable<Player>;
  line: number[];
} | null;
