# Contributing to STRling Sandbox

This repository follows the organization-wide STRling contribution standards, with one additional constraint: all implementation work must stay inside `strling-sandbox`.

## Governing References

- The shared contribution standard lives in `../.github/CONTRIBUTING.md`.
- The sandbox uses the same architectural mindset as the main `strling` repository.

## Sandbox Rules

1. Treat `../strling` and `../.github` as read-only reference material.
2. Prefer public package installs first. If a release channel fails, document the friction and use the local fallback path already defined in each demo.
3. Keep shared assets in `patterns/` so every demo consumes the same inputs.
4. When the TypeScript SemVer builder changes, regenerate `patterns/semver.ast.json` before opening a pull request.
5. Verify both demos before merging:

```bash
cd demos/typescript && bash bootstrap.sh && npm run build && npm run export && npm run verify
cd demos/python && bash bootstrap.sh && .venv/bin/python consume_semver_ast.py
```

## Pull Request Checklist

- Explain whether the change affects TypeScript authoring, Python consumption, or both.
- Call out any distribution-channel friction observed during validation.
- Include the exact commands you ran.
