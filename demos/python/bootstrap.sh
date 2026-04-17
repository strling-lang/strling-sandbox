#!/usr/bin/env bash
set -euo pipefail

rm -rf .venv

python3 -m venv .venv
. .venv/bin/activate

python -m pip install --upgrade pip

fallback_install() {
    python -m pip install --force-reinstall ../../../strling/bindings/python
}

if python -m pip install strling; then
    if python - <<'PY'
from STRling.core.parser import from_json_fixture
print(from_json_fixture)
PY
    then
        echo "Installed strling from pip."
    else
        echo "pip install strling succeeded, but the published package lacks AST fixture loading; using local fallback." >&2
        fallback_install
    fi
else
    echo "pip install strling failed; falling back to the local Python binding checkout." >&2
    fallback_install
fi