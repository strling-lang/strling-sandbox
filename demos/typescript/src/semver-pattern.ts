import { simply } from "@strling-lang/strling";

const s = simply;

const numericIdentifier = s.anyOf("0", s.merge(s.between(1, 9), s.digit(0, 0)));

const prereleaseAtom = s.inChars(s.letter(), s.digit(), "-")(1, 0);

const prereleaseSequence = s.merge(
  prereleaseAtom,
  s.merge(".", prereleaseAtom)(0, 0),
);

export const semverPattern = s.merge(
  s.start(),
  s.group("major", numericIdentifier),
  ".",
  s.group("minor", numericIdentifier),
  ".",
  s.group("patch", numericIdentifier),
  s.may(s.merge("-", s.group("prerelease", prereleaseSequence))),
  s.end(),
);

export const semverRegexSource = String(semverPattern);
