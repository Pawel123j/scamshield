# Recovery validation — 2026-11-16

This recovery consolidates main `60cd25a8a7712358291e21eb9adec60f1e583abf` (PR13 already merged externally) and PR12 `8955d5e2ad7bb275961c55a4716a984b2c957fe5` on the existing PR12 branch. Both histories are retained. It does not merge into main or deploy the app.

## Changes and evidence

- Direct credential requests now receive a strong warning. Only complete, recognized protective messages reduce credential signals; exceptions, pronoun-based requests and later sentences retain the original signals. [Synthetic before/after evidence and remaining errors](RULE_EVALUATION.md).
- Shared 75-result limit fixes the hook silently truncating history to 50. Browser coverage starts with 75 stored analyses, creates one during a quota failure, navigates to History, retries saving, and reloads; exactly the newest 75 remain. An invalid saved date displays `Nieznana data` without deleting the analysis or rewriting its source.
- Node.js 24 and locked installs agree across local instructions, CI and Docker. Existing PR12 Docker patch-copy ordering and feed-independent braces verification remain present; main's newer Vitest 5.1.0 lock entries were preserved.
- Fixed minimatch via a targeted override and raised the security gate to every severity. Braces was reviewed against upstream, reproduced against the unpatched parser in memory, and given additional attack/compatibility regressions before renewing the review deadline. [Security details](../SECURITY_PATCH.md).

Local checks: clean `npm ci`, lint, typecheck, **71 Vitest cases**, production build, and **three sandboxed Chromium scenarios PASS**. Raw npm audit: zero known advisories; parser hash/attack/compatibility gate PASS independently of the advisory feed. Production browser tests exercise real Next.js pages and localStorage; no external fraud-detection API is claimed.

Independent read-only review found a warning-masking regression and an existing invalid-date crash; both were corrected and reviewed again. The reviewer separately ran unit tests and reproduced the old braces stack overflow. Hosted CI status must be read on the current PR12 head; Docker image build/start/HTTP verification runs there. Local Docker execution was not claimed because of limited workspace disk.

## Prior PR disposition

All existing PRs remain open; this document is not permission to close or merge them. Open PR file diffs and check runs were read on 2026-11-16.

| PR | Disposition |
| --- | --- |
| #12 | Updated in place with the consolidation and recovery; retains its original ancestor. |
| #13 | Already merged into main externally; its PWA, offline and storage work is preserved. |
| #10, #11 | setup-python v7 and upload-artifact v7 changes incorporated here; retain until the combined head passes CI and closure is separately authorized. |
| #8 | Lucide major-version update is optional; retain separately, requires visual/API compatibility review with this head. |
| #6 | Next.js 16 upgrade is separate work requiring coordinated eslint-config-next and application checks, despite historical green CI. Current pinned Next.js 15 line is validated here. |
| #4, #5, #7 | ESLint 10, Tailwind 4 and TypeScript 7 require deliberate migrations; their historical CI fails. Do not merge standalone major bumps over this validated toolchain. |

The educational MVP still has the four documented classification mismatches, incomplete linguistic coverage, unencrypted local browser history and no verified public deployment. A low score never certifies safety. This is not a claim of production anti-fraud effectiveness.
