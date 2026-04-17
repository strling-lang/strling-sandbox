import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { defaultFlags, toCanonicalAst } from "./ast-adapter.js";
import { semverPattern, semverRegexSource } from "./semver-pattern.js";

const artifactPath = fileURLToPath(
  new URL("../../../patterns/semver.ast.json", import.meta.url),
);

const rootNode = (semverPattern as unknown as { node: unknown }).node;

if (!rootNode) {
  throw new Error(
    "Unable to read the underlying STRling AST from the TypeScript SemVer pattern.",
  );
}

const artifact = {
  version: "1.0.0",
  exportedBy: "demos/typescript/src/export-semver.ts",
  regex: semverRegexSource,
  flags: defaultFlags(),
  root: toCanonicalAst(rootNode as Record<string, unknown>),
  warnings: [],
  errors: [],
};

writeFileSync(artifactPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");

console.log(`Exported canonical AST to ${artifactPath}`);
console.log(`Regex preview: ${semverRegexSource}`);
