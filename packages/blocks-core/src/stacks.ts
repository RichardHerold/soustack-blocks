type StackEntry = {
  id?: string;
  stackId?: string;
  amount?: number;
  quantity?: number;
  version?: unknown;
  major?: unknown;
};

type StackRecordValue = number | StackEntry | { amount?: unknown; quantity?: unknown; version?: unknown; major?: unknown };

export type StackInput =
  | Record<string, StackRecordValue>
  | string
  | Array<string | StackEntry>
  | null
  | undefined;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toPositiveInteger = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
};

const extractStackAmount = (value: unknown): number | null => {
  if (isRecord(value)) {
    const version = value.version;
    const candidates = [
      toPositiveInteger(value.major),
      toPositiveInteger(value.amount),
      toPositiveInteger(value.quantity),
      toPositiveInteger(version),
      isRecord(version) ? toPositiveInteger(version.major) : null,
    ];

    return candidates.find((candidate): candidate is number => candidate !== null) ?? null;
  }

  return toPositiveInteger(value);
};

const toStackId = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return null;
};

export const parseStackTag = (value: string): { name: string; major: number | null } | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const atIndex = trimmed.lastIndexOf("@");
  if (atIndex === -1) {
    return { name: trimmed, major: 1 };
  }

  const name = trimmed.slice(0, atIndex).trim();
  const majorValue = trimmed.slice(atIndex + 1).trim();
  if (!name || !majorValue) {
    return null;
  }

  const major = toPositiveInteger(majorValue);
  return { name, major };
};

export const normalizeStacks = (input: StackInput): Record<string, number> => {
  if (!input) {
    return {};
  }

  if (typeof input === "string") {
    const parsed = parseStackTag(input);
    if (!parsed || !parsed.major) {
      return {};
    }

    return { [parsed.name]: parsed.major };
  }

  if (Array.isArray(input)) {
    return input.reduce<Record<string, number>>((acc, entry) => {
      if (typeof entry === "string") {
        const parsed = parseStackTag(entry);
        if (!parsed || !parsed.major) {
          return acc;
        }

        acc[parsed.name] = Math.max(acc[parsed.name] ?? 0, parsed.major);
        return acc;
      }

      if (isRecord(entry)) {
        const id = toStackId(entry.stackId ?? entry.id);
        if (!id) {
          return acc;
        }

        const parsed = parseStackTag(id);
        if (!parsed) {
          return acc;
        }

        const amount = extractStackAmount(entry);
        const candidates = [parsed.major, amount].filter(
          (value): value is number => typeof value === "number"
        );
        if (candidates.length === 0) {
          return acc;
        }

        const major = Math.max(...candidates);
        acc[parsed.name] = Math.max(acc[parsed.name] ?? 0, major);
      }

      return acc;
    }, {});
  }

  if (isRecord(input)) {
    return Object.entries(input).reduce<Record<string, number>>((acc, [key, value]) => {
      const parsed = parseStackTag(key);
      if (!parsed) {
        return acc;
      }

      const amount = extractStackAmount(value);
      const candidates = [parsed.major, amount].filter(
        (item): item is number => typeof item === "number"
      );
      if (candidates.length === 0) {
        return acc;
      }

      acc[parsed.name] = Math.max(acc[parsed.name] ?? 0, ...candidates);
      return acc;
    }, {});
  }

  return {};
};
