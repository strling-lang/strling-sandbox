# STRling Sandbox

`strling-sandbox` is the live laboratory for cross-language pattern matching in the STRling ecosystem.

The core `strling` repository proves the engine. This repository proves the mission: a pattern authored in one language can move through a shared artifact and behave the same way in another language without re-definition.

## Mission

- Validate the real developer experience of installing STRling from published distribution channels.
- Keep shared pattern assets in one place so demos can consume the same logic.
- Demonstrate that STRling patterns are portable across language boundaries.

## Repository Layout

```text
.
|-- CONTRIBUTING.md
|-- LICENSE
|-- docs/
|   |-- python-walkthrough.md
|   `-- typescript-walkthrough.md
|-- patterns/
|   |-- README.md
|   |-- semver.ast.json
|   |-- semver.samples.json
|   `-- semver.strl
`-- demos/
	|-- python/
	`-- typescript/
```

## First Proof: Portable SemVer

The initial proof of concept uses one shared SemVer pattern.

1. The TypeScript demo builds the pattern with the `Simply` API.
2. The TypeScript demo exports a canonical AST artifact to `patterns/semver.ast.json`.
3. The Python demo loads that exact AST artifact and validates sample versions.
4. Both demos use the same fixture set from `patterns/semver.samples.json`.

The first cut intentionally covers `major.minor.patch` plus optional prerelease identifiers. Build metadata is left out so the first portability proof stays focused on the AST handoff.

## Distribution Strategy

The sandbox prefers public installs:

- TypeScript: `@strling-lang/strling` from npm.
- Python: `strling` from pip.

If a published alpha package is unavailable or not reproducible, each demo documents a local fallback that installs from the adjacent `strling` workspace checkout. The fallback exists to keep the sandbox runnable while still surfacing distribution friction clearly.

## Current Findings

- The npm package can resolve but currently ships without the built `dist/` artifacts required by its own exports, so the TypeScript demo verifies the problem and then stages a sandbox-local fallback package.
- The pip package currently resolves to a version that lacks `from_json_fixture`, so the Python demo verifies the gap and then falls back to the local binding checkout.
- The Python binding does not yet ship a native `re` emitter for named groups, so the sandbox consumer applies a narrow compatibility shim from PCRE named-group syntax to Python `re` syntax.

## Quickstart

### TypeScript

```bash
cd demos/typescript
bash bootstrap.sh
npm run build
npm run export
npm run verify
```

### Python

```bash
cd demos/python
bash bootstrap.sh
.venv/bin/python consume_semver_ast.py
```

## Walkthroughs

- [TypeScript walkthrough](docs/typescript-walkthrough.md)
- [Python walkthrough](docs/python-walkthrough.md)

## Reference Policy

This repository is implementation-only for the sandbox. The adjacent `strling` and `.github` repositories are the reference standard for engineering rigor, but they remain read-only during sandbox work.
