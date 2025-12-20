import { normalizeStacks, parseStackTag, type StackInput } from "./stacks";

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
    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
    .map(([name, major]) => `${name}@${major}`);
};
