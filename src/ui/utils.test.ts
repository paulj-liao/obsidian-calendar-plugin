import { clamp, getWordCount, partition, getDateUIDFromFile } from "./utils";

describe("utils", () => {
  describe("clamp", () => {
    it("should return the number if within bounds", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it("should clamp to lower bound", () => {
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(-100, 0, 10)).toBe(0);
    });

    it("should clamp to upper bound", () => {
      expect(clamp(15, 0, 10)).toBe(10);
      expect(clamp(100, 0, 10)).toBe(10);
    });

    it("should handle negative bounds", () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });
  });

  describe("partition", () => {
    it("should split array based on predicate", () => {
      const isEven = (str: string) => parseInt(str) % 2 === 0;
      const [pass, fail] = partition(["1", "2", "3", "4"], isEven);

      expect(pass).toEqual(["2", "4"]);
      expect(fail).toEqual(["1", "3"]);
    });

    it("should handle empty array", () => {
      const [pass, fail] = partition([], () => true);

      expect(pass).toEqual([]);
      expect(fail).toEqual([]);
    });

    it("should handle all passing predicate", () => {
      const [pass, fail] = partition(["a", "b", "c"], () => true);

      expect(pass).toEqual(["a", "b", "c"]);
      expect(fail).toEqual([]);
    });

    it("should handle all failing predicate", () => {
      const [pass, fail] = partition(["a", "b", "c"], () => false);

      expect(pass).toEqual([]);
      expect(fail).toEqual(["a", "b", "c"]);
    });

    it("should handle string length predicate", () => {
      const isLong = (str: string) => str.length > 3;
      const [pass, fail] = partition(["hi", "hello", "bye", "world"], isLong);

      expect(pass).toEqual(["hello", "world"]);
      expect(fail).toEqual(["hi", "bye"]);
    });
  });

  describe("getWordCount", () => {
    it("should count words in simple text", () => {
      expect(getWordCount("hello world")).toBe(2);
      expect(getWordCount("one two three")).toBe(3);
    });

    it("should handle empty string", () => {
      expect(getWordCount("")).toBe(0);
    });

    it("should handle single word", () => {
      expect(getWordCount("hello")).toBe(1);
    });

    it("should handle multiple spaces", () => {
      expect(getWordCount("hello    world")).toBe(2);
    });

    it("should handle punctuation", () => {
      expect(getWordCount("Hello, world! How are you?")).toBe(5);
    });

    it("should handle numbers", () => {
      expect(getWordCount("There are 123 numbers here")).toBe(5);
      expect(getWordCount("123 456 789")).toBe(3);
    });

    it("should handle markdown syntax", () => {
      expect(getWordCount("# Heading")).toBe(2);
      expect(getWordCount("**bold** and *italic*")).toBe(3);
      expect(getWordCount("[link](url) text")).toBe(3);
    });

    it("should handle newlines", () => {
      expect(getWordCount("line one\nline two")).toBe(4);
      expect(getWordCount("line\n\nline")).toBe(2);
    });

    it("should handle CJK characters", () => {
      // Chinese characters
      expect(getWordCount("你好世界")).toBeGreaterThan(0);
      // Japanese hiragana
      expect(getWordCount("ひらがな")).toBeGreaterThan(0);
      // Mixed
      expect(getWordCount("hello 世界")).toBeGreaterThan(0);
    });

    it("should handle real note content", () => {
      const noteContent = `
# Daily Note

## Tasks
- [ ] Task 1
- [x] Task 2

## Notes
This is a test note with multiple words.
It has several lines and some markdown.
      `;

      const wordCount = getWordCount(noteContent);
      expect(wordCount).toBeGreaterThan(15);
    });
  });

  describe("getDateUIDFromFile", () => {
    it("should return null for null file", () => {
      expect(getDateUIDFromFile(null)).toBeNull();
    });

    it("should return null for undefined file", () => {
      expect(getDateUIDFromFile(undefined as any)).toBeNull();
    });

    // Note: Full testing would require mocking the daily-notes-interface
    // which is complex. These tests verify the null handling.
  });
});
