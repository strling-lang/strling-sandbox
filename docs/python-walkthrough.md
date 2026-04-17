# Python Walkthrough

This walkthrough validates the pip experience and consumes the shared AST artifact produced by the TypeScript demo.

## Run

```bash
cd demos/python
bash bootstrap.sh
.venv/bin/python consume_semver_ast.py
```

## Expected Outcome

- The script installs `strling` from pip, or falls back to the local checkout if the published package is unavailable.
- If pip resolves an older package that lacks `from_json_fixture`, the sandbox treats that as a feature gap and switches to the local fallback.
- The consumer loads `patterns/semver.ast.json` without re-authoring the pattern.
- The consumer prints both the emitted PCRE regex and the Python-compatible regex plus named-group extraction results for each valid sample.
- Invalid samples remain rejected.
