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

const isRecipeRecord = (value: unknown): value is RecipeLike =>
  typeof value === "object" && value !== null;

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
