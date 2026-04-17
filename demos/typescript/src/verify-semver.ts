import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { semverPattern } from "./semver-pattern.js";

type ValidSample = {
  value: string;
  groups: Record<string, string | null>;
};

type SampleSet = {
  valid: ValidSample[];
  invalid: string[];
};

const samplesPath = fileURLToPath(
  new URL("../../../patterns/semver.samples.json", import.meta.url),
);

const samples = JSON.parse(readFileSync(samplesPath, "utf8")) as SampleSet;
const regex = new RegExp(String(semverPattern));

const failures: string[] = [];

for (const sample of samples.valid) {
  const match = regex.exec(sample.value);
  if (!match?.groups) {
    failures.push(`Expected valid sample to match: ${sample.value}`);
    continue;
  }

  const actualGroups = Object.fromEntries(
    Object.entries(sample.groups).map(([name]) => [
      name,
      match.groups?.[name] ?? null,
    ]),
  );

  if (JSON.stringify(actualGroups) !== JSON.stringify(sample.groups)) {
    failures.push(
      `Group mismatch for ${sample.value}: expected ${JSON.stringify(sample.groups)}, got ${JSON.stringify(actualGroups)}`,
    );
  }
}

for (const sample of samples.invalid) {
  if (regex.exec(sample)) {
    failures.push(`Expected invalid sample to fail: ${sample}`);
  }
}

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(failure);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${samples.valid.length} valid and ${samples.invalid.length} invalid SemVer samples.`,
  );
}
