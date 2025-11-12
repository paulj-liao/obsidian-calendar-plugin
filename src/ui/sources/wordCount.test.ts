import { getWordLengthAsDots } from "./wordCount";
import type { TFile } from "obsidian";

// Mock the stores and window.app
const mockVault = {
  cachedRead: jest.fn(),
};

global.window = {
  app: {
    vault: mockVault,
  },
} as any;

// Mock svelte store
jest.mock("svelte/store", () => ({
  get: jest.fn(() => ({ wordsPerDot: 250 })),
}));

describe("wordCountSource", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getWordLengthAsDots", () => {
    it("should return 0 for null file", async () => {
      const result = await getWordLengthAsDots(null as any);
      expect(result).toBe(0);
    });

    it("should return 0 when wordsPerDot is 0", async () => {
      const { get } = require("svelte/store");
      get.mockReturnValue({ wordsPerDot: 0 });

      const mockFile = {} as TFile;
      const result = await getWordLengthAsDots(mockFile);

      expect(result).toBe(0);
    });

    it("should return correct number of dots for short content", async () => {
      const { get } = require("svelte/store");
      get.mockReturnValue({ wordsPerDot: 250 });

      mockVault.cachedRead.mockResolvedValue("hello world");

      const mockFile = {} as TFile;
      const result = await getWordLengthAsDots(mockFile);

      // 2 words / 250 wordsPerDot = 0.008, floor = 0, clamped to 1
      expect(result).toBe(1);
    });

    it("should cap at 5 dots maximum", async () => {
      const { get } = require("svelte/store");
      get.mockReturnValue({ wordsPerDot: 100 });

      // Generate 1000+ words
      const longText = Array(1000).fill("word").join(" ");
      mockVault.cachedRead.mockResolvedValue(longText);

      const mockFile = {} as TFile;
      const result = await getWordLengthAsDots(mockFile);

      // Should cap at 5
      expect(result).toBe(5);
    });

    it("should calculate dots correctly for medium content", async () => {
      const { get } = require("svelte/store");
      get.mockReturnValue({ wordsPerDot: 100 });

      // 250 words
      const mediumText = Array(250).fill("word").join(" ");
      mockVault.cachedRead.mockResolvedValue(mediumText);

      const mockFile = {} as TFile;
      const result = await getWordLengthAsDots(mockFile);

      // 250 words / 100 wordsPerDot = 2.5, floor = 2
      expect(result).toBe(2);
    });

    it("should handle empty content", async () => {
      const { get } = require("svelte/store");
      get.mockReturnValue({ wordsPerDot: 250 });

      mockVault.cachedRead.mockResolvedValue("");

      const mockFile = {} as TFile;
      const result = await getWordLengthAsDots(mockFile);

      expect(result).toBe(1); // Clamped to minimum of 1
    });
  });
});
