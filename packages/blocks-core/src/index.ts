export { normalizeStacks } from "./stacks";
export {
  getDeclaredStacksList,
  getIngredients,
  getIngredientSections,
  getInstructions,
  getInstructionSections,
  getProfile,
  getNormalizedStacks,
  getRecipeName,
  getStacks,
  hasStack,
  type RecipeSection,
} from "./recipe";
export {
  inferProfileFromStacks,
  KNOWN_STACK_ORDER,
  PROFILES,
} from "./registry";
export {
  isIngredientSubsection,
  isInstructionSubsection,
  flattenIngredientEntries,
  extractIngredientText,
  extractInstructionText,
  formatQuantity,
  formatDuration,
  scaleIngredient,
  getServingsAmount,
  getYieldUnit,
  normalizeSoustackIngredients,
  normalizeSoustackInstructions,
  MIN_SERVINGS,
  type IngredientEntry,
  type InstructionEntry,
  type ScaledIngredient,
} from "./recipe-display";
