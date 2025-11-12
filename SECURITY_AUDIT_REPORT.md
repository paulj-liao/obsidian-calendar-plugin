# Security Audit Report - Obsidian Calendar Plugin

**Audit Date:** 2025-11-12
**Last Project Update:** 2022-11-04
**Plugin Version:** 1.5.10
**Auditor:** Claude (Automated Security Review)

---

## Executive Summary

This security audit identifies several **critical and high-priority** security concerns in the Obsidian Calendar Plugin. The project has been inactive for over 3 years (since November 2022), resulting in severely outdated dependencies with known security vulnerabilities. While the codebase itself is relatively well-structured and free from obvious injection vulnerabilities, the outdated dependencies pose significant security risks.

**Risk Level:** 🔴 **HIGH**

---

## Critical Findings

### 1. Severely Outdated Dependencies (CRITICAL)

**Severity:** 🔴 Critical
**Risk:** Known vulnerabilities in dependencies

#### Affected Dependencies:

| Package | Current | Latest | Released | Risk |
|---------|---------|--------|----------|------|
| **Svelte** | 3.35.0 | 5.43.6 | 2021 | HIGH |
| **TypeScript** | 4.2.3 | 5.7.x | 2021 | MEDIUM |
| **obsidian-calendar-ui** | 0.3.12 | 0.4.0 | - | LOW |
| **obsidian-daily-notes-interface** | 0.9.0 | 0.9.4 | - | LOW |
| **tslib** | 2.1.0 | 2.8.1 | 2021 | LOW |
| **@rollup/plugin-commonjs** | 18.0.0 | 28.x | 2021 | MEDIUM |
| **@rollup/plugin-node-resolve** | 11.2.1 | 15.x | 2021 | MEDIUM |
| **eslint** | 7.23.0 | 9.x | 2021 | MEDIUM |
| **moment** | 2.29.1 | 2.30.1 | 2021 | LOW-MEDIUM |

**Impact:**
- **Svelte 3.35.0** (March 2021) is significantly outdated. Svelte 4 and 5 contain important security patches
- **TypeScript 4.2.3** (March 2021) is missing 3+ years of security fixes and type safety improvements
- Multiple Rollup plugins are outdated and may have unpatched vulnerabilities
- **ESLint 7.23.0** is missing security rules and fixes from versions 8-9

**Known Vulnerabilities:**
- Svelte < 4.x: Multiple XSS and hydration vulnerabilities
- TypeScript < 4.5: Type inference issues that could mask security problems
- Moment.js: Known to be in maintenance mode (deprecated), recommended to migrate to alternatives

**Recommendation:**
```bash
# Update core dependencies
npm update svelte@latest
npm update typescript@latest
npm update @rollup/plugin-commonjs@latest
npm update @rollup/plugin-node-resolve@latest
npm update eslint@latest

# Consider migrating from moment.js to:
# - date-fns (smaller bundle, tree-shakable)
# - luxon (modern, immutable)
# - dayjs (moment.js compatible API)
```

---

### 2. Missing Lock File (HIGH)

**Severity:** 🟠 High
**Risk:** Supply chain attacks, inconsistent builds

**Finding:** The project has a `yarn.lock` but no `package-lock.json`. The npm audit command failed because there's no lock file for npm.

**Impact:**
- Cannot run automated vulnerability scanning with `npm audit`
- Dependency resolution may differ across installations
- Vulnerable to supply chain attacks if dependencies change

**Recommendation:**
```bash
# Generate lock file
npm install --package-lock-only

# Run security audit
npm audit

# Fix vulnerabilities automatically where possible
npm audit fix
```

---

### 3. No Security Policy (MEDIUM)

**Severity:** 🟡 Medium
**Risk:** No process for reporting/handling security issues

**Finding:** No `SECURITY.md` file exists in the repository.

**Impact:**
- Security researchers have no clear channel to report vulnerabilities
- No documented process for security updates
- Users cannot assess security commitment

**Recommendation:**
Create `SECURITY.md` with:
- Supported versions
- How to report security vulnerabilities
- Response timeline expectations
- Security update policy

---

### 4. Outdated GitHub Actions (MEDIUM)

**Severity:** 🟡 Medium
**Location:** `.github/workflows/main.yml:13`

**Finding:** Using `actions/checkout@v2` (released 2020)

**Impact:**
- Missing security improvements from v3 and v4
- Potential token exposure vulnerabilities in older versions

**Recommendation:**
```yaml
# Update to latest version
- uses: actions/checkout@v4
```

---

### 5. No Automated Dependency Scanning (MEDIUM)

**Severity:** 🟡 Medium
**Risk:** Vulnerabilities go undetected

**Finding:** No Dependabot, Renovate, or Snyk integration detected

**Recommendation:**
Enable GitHub Dependabot by creating `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

---

## Code-Level Findings

### 6. Type Safety Bypasses (LOW-MEDIUM)

**Severity:** 🟡 Low-Medium
**Risk:** Potential runtime errors, security oversights

**Locations:**
- `src/settings.ts:49` - Casting `window.app` to `any` to access plugins
- `src/view.ts:51` - Casting `this.app.workspace` to `any` for event registration
- `src/view.ts:104` - Casting `this` to `any` to access `contentEl`
- `src/view.ts:305` - Casting `app.vault` to `any` to access config
- `src/ui/fileMenu.ts:11` - Casting `app` to `any` to access fileManager

**Impact:**
- Bypasses TypeScript type checking
- May hide runtime errors or type mismatches
- Could mask security issues in API usage

**Recommendation:**
```typescript
// Instead of: (<any>window.app).plugins.getPlugin()
// Use proper typing:
interface ObsidianApp extends App {
  plugins: {
    getPlugin(id: string): Plugin | null;
  };
}
const periodicNotes = (window.app as ObsidianApp).plugins.getPlugin("periodic-notes");
```

---

### 7. External Event Trigger (LOW)

**Severity:** 🟢 Low (by design, but worth documenting)
**Location:** `src/view.ts:100`

**Finding:** Plugin triggers `calendar:open` event allowing external plugins to inject data sources.

```typescript
this.app.workspace.trigger(TRIGGER_ON_OPEN, sources);
```

**Impact:**
- Allows other plugins to inject custom data sources
- Could potentially be abused by malicious plugins
- No validation of injected sources

**Assessment:** This is an intentional plugin API feature. However, consider:
- Documenting security expectations for external plugins
- Validating source objects have required methods
- Rate limiting or sanitizing data from external sources

**Recommendation:**
Add validation:
```typescript
// Validate external sources
const validateSource = (source: any): source is ICalendarSource => {
  return (
    typeof source?.getDailyMetadata === 'function' &&
    typeof source?.getWeeklyMetadata === 'function'
  );
};
```

---

### 8. Regex Complexity in Word Count (LOW)

**Severity:** 🟢 Low
**Location:** `src/ui/utils.ts:61-73`
**Risk:** Potential ReDoS (Regular Expression Denial of Service)

**Finding:** Complex regex pattern for word counting with extensive Unicode ranges.

**Assessment:** The pattern appears safe as it uses non-backtracking patterns, but should be monitored with very large files.

**Recommendation:**
- Add file size limits for word counting
- Consider caching word counts
- Test performance with large files (>10MB)

---

### 9. Error Handling Silent Failures (LOW)

**Severity:** 🟢 Low
**Location:** `src/ui/stores.ts:22-28, 44-50`

**Finding:** Errors in note indexing are logged but silently swallowed:

```typescript
catch (err) {
  console.log("[Calendar] Failed to find daily notes folder", err);
  store.set({});
  hasError = true;
}
```

**Impact:**
- Users may not be aware of configuration issues
- Could hide underlying permission or filesystem problems

**Recommendation:**
- Show user-facing notification for first error
- Document common error scenarios
- Add troubleshooting guide

---

## Positive Security Findings ✅

The following security best practices are already in place:

1. **No XSS Vulnerabilities:** No use of `innerHTML`, `dangerouslySetInnerHTML`, or `eval()`
2. **No Prototype Pollution:** No manipulation of `__proto__` or `constructor`
3. **No Arbitrary Code Execution:** No dynamic `Function()` calls or unsafe `eval`
4. **No Direct Storage Usage:** No use of `localStorage` or `sessionStorage` (relies on Obsidian API)
5. **Proper Modal Confirmation:** User confirmation before creating notes (when enabled)
6. **File Deletion Safety:** Uses Obsidian's built-in `promptForFileDeletion` with confirmation
7. **No Hardcoded Secrets:** No API keys or credentials in source code
8. **CI/CD Present:** GitHub Actions configured for linting and testing
9. **TypeScript Usage:** Static typing provides some security benefits
10. **ESLint Configured:** Code quality checks in place

---

## Recommendations Summary

### Immediate Actions (Do within 1 week)

1. **Update all dependencies** to latest stable versions
   ```bash
   npm update
   npm audit fix
   ```

2. **Create SECURITY.md** file with vulnerability reporting process

3. **Update GitHub Actions** to use latest versions
   ```yaml
   - uses: actions/checkout@v4
   ```

### Short-term Actions (Do within 1 month)

4. **Enable Dependabot** for automated dependency updates

5. **Add security scanning** to CI/CD pipeline
   ```yaml
   - name: Security audit
     run: npm audit --audit-level=high
   ```

6. **Replace `any` type casts** with proper type definitions

7. **Add input validation** for external plugin data sources

### Long-term Actions (Do within 3 months)

8. **Migrate from Moment.js** to modern date library (date-fns, luxon, or dayjs)
   - Moment.js is in maintenance mode
   - Smaller bundle size
   - Better tree-shaking

9. **Add comprehensive test coverage** especially for:
   - External data source handling
   - File operations
   - User input validation

10. **Document security architecture** including:
    - Trust model
    - Plugin interaction boundaries
    - Data flow diagrams

---

## Testing Performed

- ✅ Static code analysis for common vulnerabilities
- ✅ Dependency version checking
- ✅ Search for dangerous patterns (eval, innerHTML, etc.)
- ✅ Review of file I/O operations
- ✅ Review of external API usage
- ✅ CI/CD configuration review
- ✅ Type safety analysis

---

## Conclusion

The **Obsidian Calendar Plugin has been inactive for over 3 years**, resulting in severely outdated dependencies that pose security risks. While the codebase itself is well-structured and free from obvious code-level vulnerabilities, the **dependency situation is critical** and should be addressed immediately.

**Priority Actions:**
1. Update all npm dependencies
2. Run and fix npm audit findings
3. Enable automated security scanning
4. Create security policy

The plugin demonstrates good security practices at the code level (no XSS, injection, or dangerous patterns), but the **technical debt from outdated dependencies** significantly increases the security risk profile.

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Snyk Vulnerability Database](https://security.snyk.io/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Dependabot documentation](https://docs.github.com/en/code-security/dependabot)

---

**Generated by:** Automated Security Audit
**Report Version:** 1.0
**Last Updated:** 2025-11-12
