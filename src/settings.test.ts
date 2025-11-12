import { defaultSettings } from "./settings";

describe("settings", () => {
  describe("defaultSettings", () => {
    it("should have correct default values", () => {
      expect(defaultSettings.shouldConfirmBeforeCreate).toBe(true);
      expect(defaultSettings.weekStart).toBe("locale");
      expect(defaultSettings.wordsPerDot).toBe(250);
      expect(defaultSettings.showWeeklyNote).toBe(false);
      expect(defaultSettings.weeklyNoteFormat).toBe("");
      expect(defaultSettings.weeklyNoteTemplate).toBe("");
      expect(defaultSettings.weeklyNoteFolder).toBe("");
      expect(defaultSettings.localeOverride).toBe("system-default");
    });

    it("should be frozen (immutable)", () => {
      expect(() => {
        // @ts-expect-error - testing runtime behavior
        defaultSettings.wordsPerDot = 500;
      }).toThrow();
    });

    it("should have all required properties", () => {
      const requiredProps = [
        "shouldConfirmBeforeCreate",
        "weekStart",
        "wordsPerDot",
        "showWeeklyNote",
        "weeklyNoteFormat",
        "weeklyNoteTemplate",
        "weeklyNoteFolder",
        "localeOverride",
      ];

      requiredProps.forEach((prop) => {
        expect(defaultSettings).toHaveProperty(prop);
      });
    });
  });
});
