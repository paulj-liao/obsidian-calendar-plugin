# Build and Testing Guide

This guide provides comprehensive instructions for building and testing the Obsidian Calendar Plugin locally.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Instructions](#build-instructions)
- [Installation in Obsidian](#installation-in-obsidian)
- [Testing New Features](#testing-new-features)
- [Running Tests](#running-tests)
- [Troubleshooting](#troubleshooting)
- [Development Workflow](#development-workflow)

## Prerequisites

Before building the plugin, ensure you have:

- **Node.js**: Version 20.x or later
- **Yarn**: Package manager (install with `npm install -g yarn`)
- **Obsidian**: Installed with at least one vault
- **Git**: For version control

### Verify Prerequisites

```bash
node --version   # Should be v20.x or higher
yarn --version   # Should be 1.x or higher
```

## Build Instructions

### 1. Clone and Setup

```bash
# Navigate to the project directory
cd /home/user/obsidian-calendar-plugin

# Install dependencies
yarn install
```

This will install all dependencies listed in `package.json`, including:
- TypeScript 5.7.2
- Rollup 4.28.1
- Jest 29.7.0
- ESLint 8.57.1
- And all other required packages

### 2. Build the Plugin

```bash
# Production build
yarn build
```

**Build output:**
- `main.js` - Compiled plugin code (~276KB)
- `styles.css` - Plugin styles
- `manifest.json` - Plugin metadata

The build process:
1. Runs ESLint to check code quality
2. Compiles TypeScript using Rollup
3. Bundles all dependencies
4. Outputs to the root directory

### 3. Development Build (Watch Mode)

For active development, use watch mode to automatically rebuild on file changes:

```bash
yarn dev
```

This will:
- Watch for file changes
- Automatically rebuild when you save
- Keep running until you stop it (Ctrl+C)

## Installation in Obsidian

### Method 1: Manual Installation (Recommended for Testing)

This method is best for one-time testing:

1. **Locate your Obsidian plugins folder:**
   ```
   <YOUR_VAULT>/.obsidian/plugins/
   ```

2. **Create the calendar plugin directory:**
   ```bash
   mkdir -p "/path/to/your/vault/.obsidian/plugins/calendar"
   ```

3. **Copy the built files:**
   ```bash
   cp main.js "/path/to/your/vault/.obsidian/plugins/calendar/"
   cp styles.css "/path/to/your/vault/.obsidian/plugins/calendar/"
   cp manifest.json "/path/to/your/vault/.obsidian/plugins/calendar/"
   ```

4. **Reload Obsidian:**
   - Windows/Linux: Press `Ctrl+R`
   - macOS: Press `Cmd+R`
   - Or: Fully restart Obsidian

5. **Enable the plugin:**
   - Open Settings → Community plugins
   - Find "Calendar" in the list
   - Toggle it ON

### Method 2: Symlink (Recommended for Development)

This method allows automatic updates when you rebuild:

```bash
# Create a symlink from your project to the vault's plugin folder
ln -s "$(pwd)" "/path/to/your/vault/.obsidian/plugins/calendar"

# Now run dev mode
yarn dev
```

With this setup:
- Edit code in your project
- Save the file
- Rollup automatically rebuilds
- Reload Obsidian (`Ctrl+R` / `Cmd+R`)
- See your changes immediately

### Method 3: Copy Script

Create a helper script for easy copying:

```bash
#!/bin/bash
# build-and-copy.sh
yarn build
cp main.js styles.css manifest.json "/path/to/your/vault/.obsidian/plugins/calendar/"
echo "Files copied! Reload Obsidian to see changes."
```

Make it executable and use it:
```bash
chmod +x build-and-copy.sh
./build-and-copy.sh
```

## Testing New Features

### 1. Verify Plugin Loading

After installation:

1. **Check plugin status:**
   - Settings → Community plugins
   - Calendar should be listed and enabled

2. **Check for errors:**
   - Open Developer Console: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)
   - Look for any `[Calendar]` error messages
   - Check the Console tab for startup errors

### 2. Test Error Notifications

Test the new error notification system:

**Test 1: Missing Daily Notes Plugin**
```
1. Disable the Daily Notes core plugin
2. Click on a date in the calendar
3. Expected: Notification appears:
   "Calendar: Unable to load daily notes. Please check your Daily Notes plugin settings."
```

**Test 2: Invalid Note Creation**
```
1. Configure an invalid daily notes folder (e.g., "/invalid/path")
2. Try to create a note by clicking a date
3. Expected: Error notification with specific message
4. Check console for detailed error log
```

### 3. Test Input Validation

Test the new input validation features:

**Test 1: Words Per Dot Validation**
```
1. Settings → Calendar → "Words per dot"
2. Try entering: -5
   Expected: Error notification "must be a positive whole number"
3. Try entering: 0
   Expected: Same error, value reverts
4. Try entering: abc
   Expected: Same error, value reverts
5. Try entering: 3.5
   Expected: Same error (must be integer)
6. Try entering: 250
   Expected: Accepts and saves
```

**Test 2: Path Traversal Prevention**
```
1. Settings → Calendar → Enable "Show week number"
2. In "Weekly note folder", try entering: ../../../etc/passwd
   Expected: Error notification "contains invalid characters"
3. Try entering: folder<>name
   Expected: Same error
4. Try entering: valid/folder/path
   Expected: Accepts and saves
```

**Test 3: Weekly Note Format Validation**
```
1. In "Weekly note format", try entering: YYYY-[W]ww
   Expected: Accepts (valid format)
2. Try entering: ../../../secret
   Expected: Error notification
3. Try entering: format|with*invalid?chars
   Expected: Error notification
```

### 4. Test Core Functionality

Verify existing features still work:

**Daily Notes**
```
1. Enable Daily Notes core plugin
2. Configure format (e.g., YYYY-MM-DD)
3. Click any date in calendar
4. Expected: Creates/opens daily note
5. Verify word count dots appear correctly
```

**Weekly Notes**
```
1. Enable "Show week number" in settings
2. Configure weekly note format (e.g., YYYY-[W]ww)
3. Click on a week number
4. Expected: Creates/opens weekly note
```

**Commands**
```
1. Open command palette (Ctrl+P / Cmd+P)
2. Search: "Calendar: Open view"
3. Expected: Calendar appears in right sidebar
4. Search: "Calendar: Reveal active note"
5. Expected: Calendar highlights current note's date
```

### 5. Test Updated Dependencies

Verify compatibility with updated packages:

**Svelte (3.35.0 → 3.59.2)**
```
- Calendar UI renders correctly
- Hover states work
- Clicking dates works
- No console errors about Svelte
```

**TypeScript (4.2.3 → 5.7.2)**
```
- No runtime type errors
- All features work as expected
```

**Moment.js**
```
- Dates display correctly
- Locales work properly
- Week calculations are accurate
```

## Running Tests

The plugin includes a comprehensive Jest test suite.

### Run All Tests

```bash
yarn test
```

**Expected output:**
```
Test Suites: 2 skipped, 3 passed, 3 of 5 total
Tests:       2 skipped, 29 passed, 31 total
Snapshots:   0 total
Time:        ~5s
```

### Run Tests in Watch Mode

For development, run tests continuously:

```bash
yarn test --watch
```

This will:
- Watch for file changes
- Re-run affected tests
- Show results immediately

### Run Tests with Coverage

To see code coverage:

```bash
yarn test --coverage
```

Coverage goals:
- Utility functions: 100%
- Core business logic: 80%+
- Overall: 70%+

### Test Files

The test suite includes:

1. **src/ui/utils.test.ts** - Utility function tests
   - `clamp()` - Number clamping
   - `partition()` - Array partitioning
   - `getWordCount()` - Word counting (including CJK)
   - `classList()` - Class name generation

2. **src/settings.test.ts** - Settings validation tests
   - Default settings validation
   - Settings immutability
   - Type checking

3. **src/integration.test.ts** - Integration tests
   - Plugin constants
   - Configuration validation
   - Environment checks

4. **src/ui/sources/tasks.test.ts** - Task source tests (skipped)
   - Documented reason for skipping
   - Type compatibility issues

5. **src/ui/sources/wordCount.test.ts** - Word count tests (skipped)
   - Documented reason for skipping
   - Type compatibility issues

## Troubleshooting

### Plugin Doesn't Appear in Settings

**Problem:** Calendar plugin not visible in Community Plugins list.

**Solutions:**
1. Verify all three files are copied:
   ```bash
   ls -la /path/to/vault/.obsidian/plugins/calendar/
   # Should show: main.js, styles.css, manifest.json
   ```
2. Check folder name is exactly `calendar` (lowercase)
3. Reload Obsidian: `Ctrl+R` / `Cmd+R`
4. Check console for loading errors

### Build Fails with "Module not found"

**Problem:** Dependency errors during build.

**Solutions:**
1. Delete and reinstall dependencies:
   ```bash
   rm -rf node_modules yarn.lock
   yarn install
   ```
2. Verify Node.js version: `node --version` (should be 20.x+)
3. Clear Yarn cache: `yarn cache clean`

### Tests Fail

**Problem:** Tests return errors or failures.

**Solutions:**
1. Rebuild the project: `yarn build`
2. Clear Jest cache: `yarn test --clearCache`
3. Verify test configuration: Check `tsconfig.jest.json` exists
4. Check for syntax errors in test files

### Changes Not Appearing in Obsidian

**Problem:** Code changes don't show up after rebuild.

**Solutions:**
1. **If using manual copy:** Recopy all files after building
2. **If using symlink:** Ensure symlink is correct:
   ```bash
   ls -la /path/to/vault/.obsidian/plugins/calendar
   # Should show: calendar -> /path/to/project
   ```
3. **Hard reload Obsidian:**
   - Close Obsidian completely
   - Delete `.obsidian/workspace` (resets UI state)
   - Reopen Obsidian
4. **Check build output:** Ensure `main.js` timestamp is recent
5. **Clear Obsidian cache:**
   - Close Obsidian
   - Delete `.obsidian/app.json`
   - Reopen Obsidian

### Calendar Doesn't Show Dates

**Problem:** Calendar appears but dates are missing or empty.

**Solutions:**
1. **Enable Daily Notes plugin:**
   - Settings → Core plugins
   - Enable "Daily notes"
2. **Configure Daily Notes:**
   - Settings → Daily notes
   - Set date format (e.g., `YYYY-MM-DD`)
   - Set notes folder
   - Set template (optional)
3. **Reload plugin:**
   - Disable and re-enable Calendar plugin
   - Or reload Obsidian

### ESLint Errors During Build

**Problem:** Build shows ESLint warnings/errors.

**Note:** The build is configured to continue with warnings (`|| true`), so this shouldn't block the build.

**Expected warnings:**
- `@typescript-eslint/no-explicit-any` - Some unavoidable due to external types
- `no-control-regex` - In validation regex (intentional)
- Type warnings from `obsidian-daily-notes-interface` (known issue)

**If build fails:**
1. Check for syntax errors in your changes
2. Run `yarn lint` to see all issues
3. Fix critical errors (not warnings)

### Console Errors in Obsidian

**Problem:** Errors appear in browser console.

**Common errors and solutions:**

1. **"Cannot read property 'moment' of undefined"**
   - Moment.js not loaded yet
   - Usually resolves on next reload

2. **"[Calendar] Failed to find daily notes folder"**
   - Check Daily Notes plugin settings
   - Verify folder exists in vault

3. **Type errors about TFile**
   - Known issue with package type mismatches
   - Should not affect functionality
   - Documented in code comments

## Development Workflow

### Recommended Setup for Active Development

1. **Terminal 1: Development server**
   ```bash
   yarn dev
   ```

2. **Terminal 2: Test watcher**
   ```bash
   yarn test --watch
   ```

3. **Terminal 3: Commands**
   ```bash
   # Available for git, builds, etc.
   ```

4. **Obsidian: Testing environment**
   - Use symlink for auto-updates
   - Keep Developer Console open
   - Reload with `Ctrl+R` after rebuilds

### Making Changes

1. **Before coding:**
   - Create a feature branch: `git checkout -b feature/my-feature`
   - Run tests to ensure baseline: `yarn test`

2. **During coding:**
   - Watch mode rebuilds automatically
   - Check for TypeScript errors in terminal
   - Watch test output for regressions

3. **After coding:**
   - Run full test suite: `yarn test`
   - Build production version: `yarn build`
   - Test in Obsidian thoroughly
   - Check console for errors

4. **Before committing:**
   - Ensure all tests pass
   - Run linter: `yarn lint`
   - Build succeeds: `yarn build`
   - Manual testing complete

### Code Quality Checks

Before pushing changes:

```bash
# Run all checks
yarn test          # All tests pass
yarn lint          # Code style checks
yarn build         # Builds successfully

# If all pass, commit and push
git add .
git commit -m "Description of changes"
git push
```

## Quick Reference

### Essential Commands

```bash
yarn install       # Install dependencies
yarn build         # Production build
yarn dev           # Development watch mode
yarn test          # Run tests once
yarn test --watch  # Run tests continuously
yarn lint          # Check code style
```

### File Locations

```
Project structure:
├── src/               # Source code
│   ├── main.ts       # Plugin entry point
│   ├── settings.ts   # Settings UI
│   ├── view.ts       # Calendar view
│   └── ui/           # UI components
├── main.js           # Built output
├── styles.css        # Styles
├── manifest.json     # Plugin metadata
└── docs/             # Documentation

Obsidian structure:
<vault>/.obsidian/plugins/calendar/
├── main.js
├── styles.css
└── manifest.json
```

### Testing Checklist

Use this checklist for manual testing:

```
[ ] Plugin loads without errors
[ ] Calendar view appears in right sidebar
[ ] Clicking dates creates/opens daily notes
[ ] Week numbers appear (if enabled)
[ ] Settings page loads correctly
[ ] Input validation works (try invalid values)
[ ] Error notifications appear appropriately
[ ] Word count dots display correctly
[ ] Commands work (Open view, Reveal note)
[ ] No console errors during normal use
[ ] Tests pass: yarn test
[ ] Build succeeds: yarn build
```

## Additional Resources

- **Obsidian API Docs:** https://docs.obsidian.md/
- **Plugin Development:** https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin
- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **Jest Testing:** https://jestjs.io/docs/getting-started
- **Contributing Guide:** See `../CONTRIBUTING.md`

## Getting Help

If you encounter issues not covered here:

1. Check the **console** for error messages
2. Review **CONTRIBUTING.md** for development guidelines
3. Search existing **GitHub issues**
4. Check **Obsidian forum** for similar problems
5. Create a new **GitHub issue** with details

---

**Last Updated:** 2025-11-12
**Plugin Version:** 1.5.11+
**Node Version:** 20.x
**TypeScript Version:** 5.7.2
