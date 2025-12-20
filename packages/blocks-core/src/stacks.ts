export type StackInput =
  | Record<string, number>
  | Array<string | { id?: string; stackId?: string; amount?: number; quantity?: number }>
  | null
  | undefined;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
};

const toStackId = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return null;
};

export const normalizeStacks = (input: StackInput): Record<string, number> => {
  if (!input) {
    return {};
  }

  if (Array.isArray(input)) {
    return input.reduce<Record<string, number>>((acc, entry) => {
      if (typeof entry === "string") {
        acc[entry] = (acc[entry] ?? 0) + 1;
        return acc;
      }

      if (isRecord(entry)) {
        const id = toStackId(entry.stackId ?? entry.id);
        if (!id) {
          return acc;
        }

        const amount =
          toNumber(entry.amount) ||
          toNumber(entry.quantity) ||
          1;

        acc[id] = (acc[id] ?? 0) + amount;
      }

      return acc;
    }, {});
  }

  if (isRecord(input)) {
    return Object.entries(input).reduce<Record<string, number>>((acc, [key, value]) => {
      const amount = toNumber(value);
      if (amount !== 0) {
        acc[key] = amount;
      }
      return acc;
    }, {});
  }

  return {};
};
