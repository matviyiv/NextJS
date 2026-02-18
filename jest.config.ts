import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(uuid|@reduxjs/toolkit)/)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "test-utils"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
