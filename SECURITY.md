# Security Policy

## Supported Versions

We take security seriously and provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.5.x   | :white_check_mark: |
| < 1.5   | :x:                |

## Reporting a Vulnerability

We appreciate your efforts to responsibly disclose security vulnerabilities. If you discover a security issue in the Obsidian Calendar Plugin, please follow these guidelines:

### How to Report

**Do NOT create a public GitHub issue for security vulnerabilities.**

Instead, please report security vulnerabilities by:

1. **Email:** Send details to the maintainer at [liamcain on GitHub](https://github.com/liamcain)
2. **GitHub Security Advisory:** Use [GitHub's private vulnerability reporting](https://github.com/liamcain/obsidian-calendar-plugin/security/advisories/new) (preferred method)

### What to Include

Please include as much of the following information as possible:

- Type of vulnerability (e.g., XSS, SQL injection, authentication bypass)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it
- Any potential mitigations you've identified

### Response Timeline

- **Initial Response:** We aim to acknowledge receipt of your report within 48 hours
- **Status Update:** We will provide a more detailed response within 7 days, indicating the next steps
- **Fix Timeline:** We aim to release a fix within 30 days for critical vulnerabilities
- **Public Disclosure:** We follow coordinated disclosure and will work with you on the disclosure timeline

### What to Expect

1. **Acknowledgment:** We will acknowledge your report and may ask for additional information
2. **Investigation:** We will investigate the issue and determine its validity and severity
3. **Fix Development:** If confirmed, we will develop a fix
4. **Release:** We will release a patched version
5. **Credit:** With your permission, we will credit you in the release notes and/or security advisory

## Security Best Practices for Users

To ensure you're using the plugin securely:

1. **Keep Updated:** Always use the latest version of the plugin
2. **Review Permissions:** Understand what file system access the plugin requires
3. **Trusted Sources:** Only install plugins from the official Obsidian Community Plugins repository
4. **Report Issues:** If you notice suspicious behavior, report it promptly

## Known Security Considerations

### Plugin Architecture

This plugin:
- Reads and writes files in your Obsidian vault
- Uses the Obsidian API for all file operations
- Does not make external network requests
- Does not collect or transmit user data
- Runs within Obsidian's plugin sandbox

### Dependencies

We regularly update dependencies to address security vulnerabilities. You can review our dependency security status in our CI/CD pipeline and the `SECURITY_AUDIT_REPORT.md` file.

### External Plugin Integration

This plugin supports the `calendar:open` event that allows other plugins to provide data sources. Be aware:
- Only install trusted plugins that interact with the calendar
- Data sources from external plugins are not validated by this plugin
- Malicious plugins could potentially inject misleading data

## Security Updates

Security updates will be released as patch versions and announced via:
- GitHub Releases
- Obsidian Community Plugins update mechanism
- GitHub Security Advisories (for critical issues)

## Scope

This security policy applies to:
- The Obsidian Calendar Plugin source code in this repository
- Released versions available in the Obsidian Community Plugins repository

It does not cover:
- Third-party plugins that integrate with this plugin
- Obsidian core application security
- User vault data security (this is the user's responsibility)

## Security Audit

A comprehensive security audit was conducted in November 2025. The full report is available in `SECURITY_AUDIT_REPORT.md`.

## Questions

If you have questions about this security policy, please create a [GitHub Discussion](https://github.com/liamcain/obsidian-calendar-plugin/discussions) or reach out to the maintainer.

---

**Last Updated:** 2025-11-12
**Policy Version:** 1.0
