/**
 * Integration tests for the Calendar Plugin
 * These tests verify the plugin's core functionality
 */

import { VIEW_TYPE_CALENDAR, DEFAULT_WORDS_PER_DOT, DEFAULT_WEEK_FORMAT, TRIGGER_ON_OPEN } from "./constants";
import { defaultSettings } from "./settings";

describe("Calendar Plugin Integration", () => {
  describe("Plugin Lifecycle", () => {
    it("should be importable", () => {
      // This test verifies the plugin constants can be imported
      expect(VIEW_TYPE_CALENDAR).toBeDefined();
    });
  });

  describe("View Registration", () => {
    it("should export VIEW_TYPE_CALENDAR constant", () => {
      expect(VIEW_TYPE_CALENDAR).toBe("calendar");
    });

    it("should have TRIGGER_ON_OPEN event", () => {
      expect(TRIGGER_ON_OPEN).toBe("calendar:open");
    });
  });

  describe("Default Settings", () => {
    it("should have sensible defaults", () => {
      // Confirm before creating notes (safety)
      expect(defaultSettings.shouldConfirmBeforeCreate).toBe(true);

      // Reasonable word threshold
      expect(defaultSettings.wordsPerDot).toBeGreaterThan(0);
      expect(defaultSettings.wordsPerDot).toBeLessThan(1000);

      // Valid locale
      expect(typeof defaultSettings.localeOverride).toBe("string");
    });
  });

  describe("Constants", () => {
    it("should have valid default constants", () => {
      expect(DEFAULT_WORDS_PER_DOT).toBe(250);
      expect(DEFAULT_WEEK_FORMAT).toBeTruthy();
      expect(typeof TRIGGER_ON_OPEN).toBe("string");
    });
  });
});
