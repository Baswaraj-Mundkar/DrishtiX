# Security notes

DrishtiX is an academic prototype, not a production service.

## Current security boundary

- The Express report API is disabled in production mode.
- When enabled for a local demo, the server listens only on `127.0.0.1`.
- The login page only changes a browser-side demo role. It is not authentication.
- The local report API has no production-grade identity, authorization, or multi-user privacy model.
- Do not expose the demo API through a reverse proxy or public network.
- Do not enter sensitive personal information or real incident reports.

## Secrets

Never commit API keys, passwords, tokens, private keys, or real environment files. Browser-delivered JavaScript and HTML are public; secrets must never be stored there.

If a secret is ever committed, revoke or rotate it immediately. Removing it from the latest version does not remove it from Git history. History cleanup and a fresh secret scan are also required.

## Reporting a vulnerability

For a vulnerability in this student project, contact the project maintainers privately before publishing exploit details. Include the affected file, impact, and reproducible steps where possible.

## Automated checks

The CI workflow runs Node.js tests, JavaScript syntax checks, and `npm audit`. Dependabot checks npm and GitHub Actions dependencies weekly. Passing these checks does not constitute a full penetration test or production security certification.
