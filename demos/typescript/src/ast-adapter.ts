type CanonicalClassMember =
  | { type: "Range"; from: string; to: string }
  | { type: "Literal"; value: string }
  | { type: "Escape"; kind: string }
  | { type: "UnicodeProperty"; value: string; negated?: boolean };

export type CanonicalNode =
  | { type: "Sequence"; parts: CanonicalNode[] }
  | { type: "Alternation"; alternatives: CanonicalNode[] }
  | { type: "Literal"; value: string }
  | { type: "Dot" }
  | { type: "Anchor"; at: string }
  | {
      type: "CharacterClass";
      negated: boolean;
      members: CanonicalClassMember[];
    }
  | {
      type: "Quantifier";
      target: CanonicalNode;
      min: number;
      max: number | null;
      lazy?: boolean;
      possessive?: boolean;
    }
  | {
      type: "Group";
      capturing: boolean;
      body: CanonicalNode;
      name?: string;
      atomic?: boolean;
    }
  | { type: "Lookahead"; body: CanonicalNode }
  | { type: "NegativeLookahead"; body: CanonicalNode }
  | { type: "Lookbehind"; body: CanonicalNode }
  | { type: "NegativeLookbehind"; body: CanonicalNode }
  | { type: "Backreference"; index?: number; name?: string };

type FlagsShape = {
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  extended: boolean;
};

type PatternNodeShape = {
  constructor?: { name?: string };
  [key: string]: unknown;
};

function getNodeKind(node: PatternNodeShape): string {
  const kind = node.constructor?.name;
  if (!kind) {
    throw new Error("Unable to determine STRling node kind for AST export.");
  }
  return kind;
}

function toClassMember(member: PatternNodeShape): CanonicalClassMember {
  switch (getNodeKind(member)) {
    case "ClassRange":
      return {
        type: "Range",
        from: String(member.fromCh),
        to: String(member.toCh),
      };
    case "ClassLiteral":
      return {
        type: "Literal",
        value: String(member.ch),
      };
    case "ClassEscape": {
      const escapeType = String(member.type);
      if (escapeType === "p" || escapeType === "P") {
        return {
          type: "UnicodeProperty",
          value: String(member.property),
          negated: escapeType === "P",
        };
      }

      const kindMap: Record<string, string> = {
        d: "digit",
        D: "not-digit",
        s: "space",
        S: "not-space",
        w: "word",
        W: "not-word",
      };

      return {
        type: "Escape",
        kind: kindMap[escapeType] ?? escapeType,
      };
    }
    default:
      throw new Error(
        `Unsupported STRling class member kind: ${getNodeKind(member)}`,
      );
  }
}

export function toCanonicalAst(node: PatternNodeShape): CanonicalNode {
  switch (getNodeKind(node)) {
    case "Seq":
      return {
        type: "Sequence",
        parts: (node.parts as PatternNodeShape[]).map(toCanonicalAst),
      };
    case "Alt":
      return {
        type: "Alternation",
        alternatives: (node.branches as PatternNodeShape[]).map(toCanonicalAst),
      };
    case "Lit":
      return {
        type: "Literal",
        value: String(node.value),
      };
    case "Dot":
      return { type: "Dot" };
    case "Anchor":
      return {
        type: "Anchor",
        at: String(node.at),
      };
    case "CharClass":
      return {
        type: "CharacterClass",
        negated: Boolean(node.negated),
        members: (node.items as PatternNodeShape[]).map(toClassMember),
      };
    case "Quant": {
      const mode = String(node.mode);
      const result: CanonicalNode = {
        type: "Quantifier",
        target: toCanonicalAst(node.child as PatternNodeShape),
        min: Number(node.min),
        max: node.max === "Inf" ? null : Number(node.max),
      };

      if (mode === "Lazy") {
        result.lazy = true;
      }

      if (mode === "Possessive") {
        result.possessive = true;
      }

      return result;
    }
    case "Group": {
      const result: CanonicalNode = {
        type: "Group",
        capturing: Boolean(node.capturing),
        body: toCanonicalAst(node.body as PatternNodeShape),
      };

      if (typeof node.name === "string") {
        result.name = node.name;
      }

      if (typeof node.atomic === "boolean") {
        result.atomic = node.atomic;
      }

      return result;
    }
    case "Look": {
      const direction = String(node.dir);
      const negative = Boolean(node.neg);
      if (direction === "Ahead") {
        return {
          type: negative ? "NegativeLookahead" : "Lookahead",
          body: toCanonicalAst(node.body as PatternNodeShape),
        };
      }

      if (direction === "Behind") {
        return {
          type: negative ? "NegativeLookbehind" : "Lookbehind",
          body: toCanonicalAst(node.body as PatternNodeShape),
        };
      }

      throw new Error(`Unsupported STRling lookaround direction: ${direction}`);
    }
    case "Backref": {
      const result: CanonicalNode = { type: "Backreference" };
      if (typeof node.byIndex === "number") {
        result.index = node.byIndex;
      }
      if (typeof node.byName === "string") {
        result.name = node.byName;
      }
      return result;
    }
    default:
      throw new Error(
        `Unsupported STRling node kind for canonical export: ${getNodeKind(node)}`,
      );
  }
}

export function defaultFlags(): FlagsShape {
  return {
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    extended: false,
  };
}
