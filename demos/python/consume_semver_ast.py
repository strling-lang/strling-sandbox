from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from STRling.core.compiler import Compiler
from STRling.core.parser import from_json_fixture
from STRling.emitters.pcre2 import emit


ROOT = Path(__file__).resolve().parents[2]
ARTIFACT_PATH = ROOT / "patterns" / "semver.ast.json"
SAMPLES_PATH = ROOT / "patterns" / "semver.samples.json"


def load_artifact() -> dict[str, object]:
    return json.loads(ARTIFACT_PATH.read_text(encoding="utf-8"))


def load_samples() -> dict[str, object]:
    return json.loads(SAMPLES_PATH.read_text(encoding="utf-8"))


def to_python_regex(pattern: str) -> str:
    pattern = re.sub(r"\(\?<([A-Za-z_][A-Za-z0-9_]*)>", r"(?P<\1>", pattern)
    pattern = re.sub(r"\\k<([A-Za-z_][A-Za-z0-9_]*)>", r"(?P=\1)", pattern)
    return pattern


def compile_regex(artifact: dict[str, object]) -> tuple[re.Pattern[str], str, str]:
    ast_root = from_json_fixture(artifact["root"])
    ir_root = Compiler().compile(ast_root)
    pcre_regex = emit(ir_root, artifact.get("flags"))
    python_regex = to_python_regex(pcre_regex)
    return re.compile(python_regex), pcre_regex, python_regex


def main() -> int:
    artifact = load_artifact()
    samples = load_samples()
    regex, pcre_regex, python_regex = compile_regex(artifact)

    failures: list[str] = []

    print(f"Loaded AST artifact from {ARTIFACT_PATH}")
    print(f"PCRE regex: {pcre_regex}")
    print(f"Python regex: {python_regex}")

    for sample in samples["valid"]:
        value = sample["value"]
        expected_groups = sample["groups"]
        match = regex.fullmatch(value)
        if match is None:
            failures.append(f"Expected valid sample to match: {value}")
            continue

        actual_groups = match.groupdict()
        if actual_groups != expected_groups:
            failures.append(
                "Group mismatch for "
                f"{value}: expected {expected_groups}, got {actual_groups}"
            )
            continue

        print(f"MATCH {value} -> {actual_groups}")

    for value in samples["invalid"]:
        if regex.fullmatch(value) is not None:
            failures.append(f"Expected invalid sample to fail: {value}")

    if failures:
        for failure in failures:
            print(failure, file=sys.stderr)
        return 1

    print(
        f"Verified {len(samples['valid'])} valid and {len(samples['invalid'])} invalid SemVer samples."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
