#!/usr/bin/env bash
set -euo pipefail

rm -rf node_modules .sandbox-cache package-lock.json

fallback_install() {
    rm -rf .sandbox-cache
    mkdir -p .sandbox-cache
    cp -R ../../../strling/bindings/typescript .sandbox-cache/strling-typescript

    pushd .sandbox-cache/strling-typescript >/dev/null
    npm install
    npm run build
    popd >/dev/null

    rm -rf node_modules/@strling-lang/strling
    npm install --no-save @types/node typescript ./.sandbox-cache/strling-typescript
}

if npm install; then
    if [[ -f node_modules/@strling-lang/strling/dist/index.js && -f node_modules/@strling-lang/strling/dist/index.d.ts ]]; then
        echo "Installed @strling-lang/strling from npm."
    else
        echo "npm install completed, but the published package is missing dist artifacts; using sandbox fallback." >&2
        fallback_install
    fi
else
    echo "npm install failed; staging a local TypeScript binding fallback inside the sandbox." >&2
    fallback_install
fi