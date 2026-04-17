# TypeScript Walkthrough

This walkthrough validates the npm experience and exports the shared AST artifact.

## Run

```bash
cd demos/typescript
bash bootstrap.sh
npm run build
npm run export
npm run verify
```

## Expected Outcome

- The project installs `@strling-lang/strling` from npm, or falls back to the local checkout if the registry path fails.
- If npm resolves a package that is missing `dist/`, the sandbox still treats that as a failure and switches to the staged local fallback.
- `npm run build` confirms the package types resolve in a strict TypeScript project.
- `npm run export` writes `patterns/semver.ast.json`.
- `npm run verify` proves the authored SemVer pattern accepts and rejects the shared sample set as expected.
