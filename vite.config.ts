/// <reference types="vitest/config" />
import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  test: {
    projects: [
      {
        test: {
          include: ["src/**/*.test.ts"],
          name: "unit",
          environment: "node",
        },
      },
      {
        test: {
          include: ["src/**/*.test.tsx"],
          name: "browser",
          browser: {
            provider: playwright({
              launchOptions: {
                // Use system chrome locally, but default playwright binary in CI
                // TODO: Once playwright support ubuntu 26 lts we can remove this
                channel: process.env.CI ? undefined : "chrome",
              },
            }),
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
