import { KNOWN_STACK_ORDER } from "./registry";
import { normalizeStacks, parseStackTag, type StackInput } from "./stacks";

type RecipeLike = {
  name?: string;
  title?: string;
  profile?: string;
  stacks?: StackInput;
  declaredStacks?: StackInput | string[];
  declaredStacksList?: StackInput | string[];
  ingredients?: unknown;
  instructions?: unknown;
};

export type RecipeSection = { title?: string; items: string[] };

const isRecipeRecord = (value: unknown): value is RecipeLike =>
  typeof value === "object" && value !== null;

const stringifyItem = (item: unknown): string => {
  if (typeof item === "string") {
    return item;
  }

  if (typeof item === "number" || typeof item === "boolean") {
    return String(item);
  }

  if (item && typeof item === "object") {
    const record = item as Record<string, unknown>;
    const label =
      typeof record.name === "string"
        ? record.name
        : typeof record.title === "string"
          ? record.title
          : undefined;
    const amount =
      typeof record.amount === "string" || typeof record.amount === "number"
        ? String(record.amount)
        : typeof record.quantity === "string" ||
            typeof record.quantity === "number"
          ? String(record.quantity)
          : undefined;
    const description =
      typeof record.description === "string"
        ? record.description
        : typeof record.step === "string"
          ? record.step
          : undefined;

    const composed = [label, amount ? `(${amount})` : undefined, description]
      .filter(Boolean)
      .join(" ");

    if (composed) {
      return composed;
    }

    const entries = Object.entries(record)
      .map(([key, value]) => {
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          return `${key}: ${value}`;
        }

        return undefined;
      })
      .filter((entry): entry is string => Boolean(entry));

    if (entries.length > 0) {
      return entries.join(", ");
    }
  }

  return "";
};

const normalizeList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => stringifyItem(item)).filter(Boolean);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return [value];
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidate = Array.isArray(record.items)
      ? record.items
      : Object.values(record);

    if (Array.isArray(candidate)) {
      return candidate.map((item) => stringifyItem(item)).filter(Boolean);
    }
  }

  return [];
};

const normalizeSectionList = (
  value: unknown,
  key: "ingredients" | "steps"
): RecipeSection[] => {
  if (Array.isArray(value)) {
    const sections = value
      .map((entry) => {
        if (entry && typeof entry === "object" && !Array.isArray(entry)) {
          const record = entry as Record<string, unknown>;
          const items = normalizeList(record[key] ?? record.items);
          const title = typeof record.section === "string" ? record.section : undefined;
          if (items.length > 0 || title) {
            return { title, items };
          }

          const singleItem = stringifyItem(entry);
          if (!singleItem) {
            return undefined;
          }

          return { items: [singleItem] };
        }

        const singleItem = stringifyItem(entry);
        if (!singleItem) {
          return undefined;
        }

        return { items: [singleItem] };
      })
      .filter((section): section is RecipeSection => Boolean(section));

    if (sections.length > 0) {
      return sections;
    }
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as Record<string, unknown>;
    const items = normalizeList(record[key] ?? record.items);
    const title = typeof record.section === "string" ? record.section : undefined;
    if (items.length > 0 || title) {
      return [{ title, items }];
    }
  }

  const items = normalizeList(value);
  if (items.length > 0) {
    return [{ items }];
  }

  return [];
};

export const getStacks = (recipe: unknown): Record<string, number> => {
  if (!isRecipeRecord(recipe)) {
    return {};
  }

  const stacksSource =
    recipe.stacks ?? recipe.declaredStacks ?? recipe.declaredStacksList;

  return normalizeStacks(stacksSource as StackInput);
};

export const getNormalizedStacks = (recipe: unknown): Record<string, number> => getStacks(recipe);

export const hasStack = (recipe: unknown, stackId: string): boolean => {
  if (!stackId) {
    return false;
  }

  const parsed = parseStackTag(stackId);
  const lookupId = parsed?.name ?? stackId;
  const stacks = getStacks(recipe);
  return (stacks[lookupId] ?? 0) > 0;
};

export const getRecipeName = (recipe: unknown): string => {
  if (!isRecipeRecord(recipe)) {
    return "";
  }

  return recipe.name ?? recipe.title ?? "";
};

export const getProfile = (recipe: unknown): string => {
  if (!isRecipeRecord(recipe)) {
    return "";
  }

  return typeof recipe.profile === "string" ? recipe.profile : "";
};

export const getIngredients = (recipe: unknown): unknown => {
  if (!isRecipeRecord(recipe)) {
    return [];
  }

  return recipe.ingredients ?? [];
};

export const getInstructions = (recipe: unknown): unknown => {
  if (!isRecipeRecord(recipe)) {
    return [];
  }

  return recipe.instructions ?? [];
};

export const getIngredientSections = (recipe: unknown): RecipeSection[] => {
  if (!isRecipeRecord(recipe)) {
    return [];
  }

  return normalizeSectionList(recipe.ingredients, "ingredients");
};

export const getInstructionSections = (recipe: unknown): RecipeSection[] => {
  if (!isRecipeRecord(recipe)) {
    return [];
  }

  return normalizeSectionList(recipe.instructions, "steps");
};

export const getDeclaredStacksList = (recipe: unknown): string[] => {
  if (!isRecipeRecord(recipe)) {
    return [];
  }

  const declared =
    recipe.declaredStacksList ?? recipe.declaredStacks ?? recipe.stacks;

  const normalized = normalizeStacks(declared as StackInput);
  return Object.entries(normalized)
    .sort(([nameA], [nameB]) => {
      const indexA = KNOWN_STACK_ORDER.indexOf(nameA);
      const indexB = KNOWN_STACK_ORDER.indexOf(nameB);
      const normalizedA = indexA === -1 ? Number.POSITIVE_INFINITY : indexA;
      const normalizedB = indexB === -1 ? Number.POSITIVE_INFINITY : indexB;
      if (normalizedA !== normalizedB) {
        return normalizedA - normalizedB;
      }

      return nameA.localeCompare(nameB);
    })
    .map(([name, major]) => `${name}@${major}`);
};
