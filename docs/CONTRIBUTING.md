# Contributing to Obsidian Calendar Plugin

Thank you for your interest in contributing to the Obsidian Calendar Plugin! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Getting Started

### Prerequisites

- **Node.js** 20.x or later
- **Yarn** package manager
- **Git** for version control
- Basic knowledge of TypeScript and Obsidian plugin development

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/obsidian-calendar-plugin.git
   cd obsidian-calendar-plugin
   ```

3. **Add the upstream remote:**
   ```bash
   git remote add upstream https://github.com/paulj-liao/obsidian-calendar-plugin.git
   ```

4. **Install dependencies:**
   ```bash
   yarn install
   ```

5. **Build the plugin:**
   ```bash
   yarn build
   ```

## Development Workflow

### Building

```bash
# Development build (watch mode)
yarn dev

# Production build
yarn build
```

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test --coverage
```

### Linting

```bash
# Run ESLint
yarn lint
```

### Testing Your Changes in Obsidian

1. Build the plugin with `yarn build`
2. Copy `main.js`, `styles.css`, and `manifest.json` to your vault's `.obsidian/plugins/calendar/` folder
3. Reload Obsidian to see your changes

## Coding Standards

### TypeScript

- **Use TypeScript** for all new code
- **Avoid `any` types** - use proper type definitions instead
- **Document public APIs** with JSDoc comments
- **Follow existing code style** - the project uses ESLint for consistency

### Code Style

```typescript
// ✅ Good: Proper typing and documentation
/**
 * Clamps a number between bounds.
 * @param num - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(min, num), max);
}

// ❌ Bad: Missing types and documentation
export function clamp(num, min, max) {
  return Math.min(Math.max(min, num), max);
}
```

### Error Handling

- **Always handle errors gracefully**
- **Show user-friendly notifications** using Obsidian's `Notice` API
- **Log errors to console** with the `[Calendar]` prefix

```typescript
try {
  // Operation that might fail
  const note = await createDailyNote(date);
} catch (error) {
  new Notice(`Calendar: Failed to create note. ${error.message}`, 7000);
  console.error("[Calendar] Error:", error);
}
```

### Commit Messages

Write clear, descriptive commit messages:

```
✅ Good:
- "Add error notifications for failed note creation"
- "Fix word count for CJK characters"
- "Update dependencies to latest versions"

❌ Bad:
- "fix bug"
- "updates"
- "WIP"
```

## Testing

### Writing Tests

- **Test files** should be named `*.test.ts` and located next to the code they test
- **Use Jest** for unit tests
- **Test edge cases** - empty inputs, null values, boundary conditions
- **Keep tests focused** - one concept per test

Example test:

```typescript
import { clamp } from "./utils";

describe("clamp", () => {
  it("returns number if within bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to lower bound", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps to upper bound", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
```

### Test Coverage Goals

- **Utility functions:** 100% coverage
- **Core business logic:** 80%+ coverage
- **UI components:** Test behavior, not implementation details

## Submitting Changes

### Pull Request Process

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation if needed

3. **Ensure quality:**
   ```bash
   yarn lint     # Check for linting errors
   yarn test     # Run all tests
   yarn build    # Ensure it builds
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add feature: description of your changes"
   ```

5. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** on GitHub:
   - Provide a clear title and description
   - Reference any related issues (e.g., "Fixes #123")
   - Explain what changed and why
   - Include screenshots for UI changes

### Pull Request Checklist

Before submitting, ensure:

- [ ] Code follows the project's style guidelines
- [ ] All tests pass (`yarn test`)
- [ ] New code has appropriate test coverage
- [ ] Documentation has been updated (if applicable)
- [ ] Commit messages are clear and descriptive
- [ ] No linting errors (`yarn lint`)
- [ ] Plugin builds successfully (`yarn build`)

## Reporting Issues

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Update to the latest version** to see if the issue persists
3. **Check the console** for error messages (Ctrl+Shift+I in Obsidian)

### Creating an Issue

Include the following information:

- **Description:** Clear explanation of the issue
- **Steps to reproduce:** Numbered list of how to trigger the bug
- **Expected behavior:** What should happen
- **Actual behavior:** What actually happens
- **Environment:**
  - Obsidian version
  - Plugin version
  - Operating system
- **Screenshots/Logs:** If applicable

### Issue Template Example

```markdown
**Description:**
Calendar crashes when clicking on week numbers

**Steps to reproduce:**
1. Enable "Show week number" in settings
2. Click on a week number
3. Plugin crashes

**Expected behavior:**
Should create a weekly note

**Actual behavior:**
Error appears: "Cannot read property 'format' of undefined"

**Environment:**
- Obsidian: 1.5.3
- Calendar Plugin: 1.5.11
- OS: Windows 11

**Console Error:**
[Calendar] Error: Cannot read property 'format' of undefined
    at createWeeklyNote (main.js:123)
```

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards other contributors

## Questions?

If you have questions:

- Open a [GitHub Discussion](https://github.com/paulj-liao/obsidian-calendar-plugin/discussions)
- Check the [Obsidian forum](https://forum.obsidian.md/)
- Review existing issues and pull requests

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to make the Obsidian Calendar Plugin better! 🎉
