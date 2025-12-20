import { normalizeStacks, type StackInput } from "./stacks";

type RecipeLike = {
  name?: string;
  title?: string;
  stacks?: StackInput;
  declaredStacks?: StackInput | string[];
  declaredStacksList?: StackInput | string[];
  ingredients?: unknown;
  instructions?: unknown;
};

const isRecipeRecord = (value: unknown): value is RecipeLike =>
  typeof value === "object" && value !== null;

const toStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }

  if (typeof value === "string") {
    return [value];
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

export const hasStack = (recipe: unknown, stackId: string): boolean => {
  if (!stackId) {
    return false;
  }

  const stacks = getStacks(recipe);
  return (stacks[stackId] ?? 0) > 0;
};

export const getRecipeName = (recipe: unknown): string => {
  if (!isRecipeRecord(recipe)) {
    return "";
  }

  return recipe.name ?? recipe.title ?? "";
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

  if (Array.isArray(declared)) {
    return toStringList(declared);
  }

  if (typeof declared === "string") {
    return [declared];
  }

  const normalized = normalizeStacks(declared as StackInput);
  return Object.keys(normalized);
};
