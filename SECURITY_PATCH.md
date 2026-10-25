# Temporary dependency security patch

`braces@3.0.3` has no patched release for GHSA-vfj7-8cjw-p6xm in the registry at validation time (2026-10-18). Its parser now rejects AST nesting beyond 128 levels, including braces and parentheses, before recursive compilation/stringification/expansion. Normal glob expansion and ranges remain supported. Untrusted prebuilt AST objects are outside the string-pattern API used by these build tools.

`npm ci` applies the versioned patch with `patch-package --error-on-fail`. `npm run security:check` queries the full npm audit, always verifies the installed parser SHA-256 and version for the root braces installation, plus **every additional reported braces installation**, runs deeply nested/unfinished/mixed pattern regressions plus valid pattern checks, and fails on any other high/critical advisory or unavailable audit. This exact advisory is considered mitigated only with that evidence. The raw audit may still report the locked version: a source patch does not change the package version. Report the dated raw result separately from patch verification.

The exception expires on **2026-11-18** and must be reviewed against upstream. Remove the patch and exception when a compatible fixed release is available. The gate also fails if the patch is absent, modified, or applied to another version. Moderate selector-parser issues are addressed with 7.1.6 and the production build/E2E verify compatibility.

Dependency refresh validated on 2026-10-24 with Node.js 24: Vite 8.3.5 and Vitest/mocker 5.0.5. These replace the newly reported vulnerable versions without removing this parser patch or weakening the gate. The registry still lists braces 3.0.3 as its latest release; retain the existing review deadline.
