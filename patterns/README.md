# Shared Pattern Assets

`patterns/` is the contract surface between demos.

- `semver.strl` documents the human-readable pattern intent.
- `semver.ast.json` is the canonical AST artifact exported by the TypeScript demo.
- `semver.samples.json` is the shared validation corpus used by both demos.

The current canonical AST shape follows the `input_ast` conventions already used by the STRling shared spec suite, because the Python binding already knows how to load that format.
