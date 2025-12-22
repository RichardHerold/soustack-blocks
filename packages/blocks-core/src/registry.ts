export const KNOWN_STACK_ORDER = [
  "structured",
  "quantified",
  "timed",
  "compute",
  "referenced",
  "scaling",
  "equipment",
  "prep",
  "illustrated",
  "dietary",
  "storage",
  "substitutions",
  "techniques",
];

export const PROFILES: Record<string, { requiresStacks: string[]; label: string }> = {
  lite: { requiresStacks: [], label: "Lite" },
  base: { requiresStacks: [], label: "Base" },
  scalable: { requiresStacks: ["quantified", "scaling"], label: "Scalable" },
  timed: { requiresStacks: ["structured", "timed"], label: "Timed" },
  equipped: { requiresStacks: ["equipment"], label: "Equipped" },
  prepped: { requiresStacks: ["prep"], label: "Prepped" },
  illustrated: { requiresStacks: ["illustrated"], label: "Illustrated" },
};

const PROFILE_PRIORITY = [
  "scalable",
  "timed",
  "illustrated",
  "equipped",
  "prepped",
  "base",
  "lite",
];

export const inferProfileFromStacks = (
  stacks: Record<string, number>
): { profile?: string; inferred: boolean } => {
  const normalized = stacks ?? {};

  const hasStack = (name: string): boolean => (normalized[name] ?? 0) > 0;

  for (const profile of PROFILE_PRIORITY) {
    const definition = PROFILES[profile];
    if (!definition) {
      continue;
    }

    const matches = definition.requiresStacks.every((stack) => hasStack(stack));
    if (matches) {
      return { profile, inferred: true };
    }
  }

  return { profile: undefined, inferred: true };
};
