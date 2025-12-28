/**
 * Recipe display helpers for scaling, formatting, and parsing recipe data.
 * These functions handle the display-level transformations needed for interactive recipe cards.
 */

export type IngredientEntry =
  | string
  | {
      item?: string;
      name?: string;
      quantity?: number | string;
      amount?: number | string;
      unit?: string;
      description?: string;
      prepAction?: string;
      prep?: string;
      destination?: string;
      scaleBehavior?: "linear" | "sublinear" | "fixed" | "taste" | "stepped";
      scaling?: {
        type?: "linear" | "sublinear" | "fixed" | "taste" | "stepped";
      };
      meta?: {
        display?: string;
        prep?: string;
        destination?: string;
      };
      [key: string]: unknown;
    }
  | {
      subsection: string;
      items: IngredientEntry[];
    };

export type InstructionEntry =
  | string
  | {
      step?: string;
      text?: string;
      description?: string;
      scaleAdjustment?: {
        trigger?: number;
        note?: string;
      };
      [key: string]: unknown;
    }
  | {
      subsection: string;
      items: InstructionEntry[];
    };

export type ScaledIngredient = {
  display: string;
  warning?: string;
};

const MIN_SERVINGS = 0.25;

/**
 * Check if an entry is an ingredient subsection.
 */
export function isIngredientSubsection(
  entry: unknown
): entry is { subsection: string; items: IngredientEntry[] } {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "subsection" in entry &&
    "items" in entry &&
    typeof (entry as { subsection: unknown }).subsection === "string" &&
    Array.isArray((entry as { items: unknown }).items)
  );
}

/**
 * Check if an entry is an instruction subsection.
 */
export function isInstructionSubsection(
  entry: unknown
): entry is { subsection: string; items: InstructionEntry[] } {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "subsection" in entry &&
    "items" in entry &&
    typeof (entry as { subsection: unknown }).subsection === "string" &&
    Array.isArray((entry as { items: unknown }).items)
  );
}

/**
 * Extract ingredient text from an entry (best-effort).
 */
export function extractIngredientText(entry: IngredientEntry): string {
  if (typeof entry === "string") {
    return entry;
  }
  if (typeof entry === "object" && entry !== null) {
    if ("item" in entry && typeof entry.item === "string") {
      return entry.item;
    }
    if ("name" in entry && typeof entry.name === "string") {
      return entry.name;
    }
  }
  return "";
}

/**
 * Extract instruction text from a step (best-effort).
 */
export function extractInstructionText(step: InstructionEntry): string {
  if (typeof step === "string") {
    return step;
  }
  if (typeof step === "object" && step !== null) {
    if ("text" in step && typeof step.text === "string") {
      return step.text;
    }
    if ("step" in step && typeof step.step === "string") {
      return step.step;
    }
    if ("description" in step && typeof step.description === "string") {
      return step.description;
    }
  }
  return "";
}

/**
 * Flatten ingredient entries recursively, converting plain strings to objects.
 */
export function flattenIngredientEntries(
  ingredients: IngredientEntry[]
): Array<{
  item?: string;
  name?: string;
  quantity?: number | string;
  amount?: number | string;
  unit?: string;
  description?: string;
  prepAction?: string;
  prep?: string;
  destination?: string;
  scaleBehavior?: string;
  scaling?: { type?: string };
  meta?: {
    display?: string;
    prep?: string;
    destination?: string;
  };
  [key: string]: unknown;
}> {
  const result: Array<{
    item?: string;
    name?: string;
    quantity?: number | string;
    amount?: number | string;
    unit?: string;
    description?: string;
    prepAction?: string;
    prep?: string;
    destination?: string;
    scaleBehavior?: string;
    scaling?: { type?: string };
    meta?: {
      display?: string;
      prep?: string;
      destination?: string;
    };
    [key: string]: unknown;
  }> = [];

  for (const entry of ingredients) {
    if (isIngredientSubsection(entry)) {
      result.push(...flattenIngredientEntries(entry.items));
    } else if (typeof entry === "string") {
      // Convert plain string to object
      result.push({ item: entry });
    } else if (typeof entry === "object" && entry !== null) {
      result.push(entry as typeof result[0]);
    }
  }

  return result;
}

/**
 * Format a quantity with optional unit.
 * Supports unicode fractions for common values.
 */
export function formatQuantity(
  amount: number | string | undefined,
  unit?: string
): string {
  if (amount === undefined || amount === null) {
    return "";
  }

  let formattedAmount: string;
  if (typeof amount === "number") {
    // Convert common fractions to unicode
    if (amount === 0.25) formattedAmount = "¼";
    else if (amount === 0.5) formattedAmount = "½";
    else if (amount === 0.75) formattedAmount = "¾";
    else if (amount === 0.33) formattedAmount = "⅓";
    else if (amount === 0.67) formattedAmount = "⅔";
    else if (amount === 1.5) formattedAmount = "1½";
    else if (amount === 2.5) formattedAmount = "2½";
    else if (Number.isInteger(amount)) {
      formattedAmount = String(amount);
    } else {
      // Round to 2 decimal places for other decimals
      formattedAmount = amount.toFixed(2).replace(/\.?0+$/, "");
    }
  } else {
    formattedAmount = String(amount);
  }

  if (unit) {
    return `${formattedAmount} ${unit}`;
  }
  return formattedAmount;
}

/**
 * Format a duration from minutes, seconds, or ISO string (best-effort).
 */
export function formatDuration(
  minutesOrSecondsOrISO?: number | string
): string {
  if (minutesOrSecondsOrISO === undefined || minutesOrSecondsOrISO === null) {
    return "";
  }

  if (typeof minutesOrSecondsOrISO === "string") {
    // Try to parse ISO duration (e.g., "PT30M")
    const isoMatch = minutesOrSecondsOrISO.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (isoMatch) {
      const hours = parseInt(isoMatch[1] || "0", 10);
      const minutes = parseInt(isoMatch[2] || "0", 10);
      const seconds = parseInt(isoMatch[3] || "0", 10);
      const parts: string[] = [];
      if (hours > 0) parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
      if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);
      if (seconds > 0 && hours === 0 && minutes === 0) {
        parts.push(`${seconds} sec${seconds > 1 ? "s" : ""}`);
      }
      return parts.join(" ");
    }
    return minutesOrSecondsOrISO;
  }

  if (typeof minutesOrSecondsOrISO === "number") {
    // Assume minutes if > 60, otherwise assume seconds
    if (minutesOrSecondsOrISO >= 60) {
      const hours = Math.floor(minutesOrSecondsOrISO / 60);
      const minutes = minutesOrSecondsOrISO % 60;
      if (hours > 0 && minutes > 0) {
        return `${hours} hr${hours > 1 ? "s" : ""} ${minutes} min${minutes > 1 ? "s" : ""}`;
      } else if (hours > 0) {
        return `${hours} hr${hours > 1 ? "s" : ""}`;
      } else {
        return `${minutes} min${minutes > 1 ? "s" : ""}`;
      }
    } else {
      return `${minutesOrSecondsOrISO} sec${minutesOrSecondsOrISO > 1 ? "s" : ""}`;
    }
  }

  return "";
}

/**
 * Parse quantity from a string (best-effort).
 * Looks for patterns like "1 cup", "2.5", "1/2", etc.
 */
function parseQuantityFromText(text: string): {
  amount: number | undefined;
  unit: string | undefined;
} {
  // Try to match common patterns
  // Pattern: "1 cup", "2.5 cups", "1/2 teaspoon"
  const match = text.match(
    /^(\d+(?:\.\d+)?|\d+\/\d+|¼|½|¾|⅓|⅔)\s*(.*?)$/
  );
  if (match) {
    let amount: number | undefined;
    const amountStr = match[1];
    const unit = match[2]?.trim() || undefined;

    // Handle unicode fractions
    if (amountStr === "¼") amount = 0.25;
    else if (amountStr === "½") amount = 0.5;
    else if (amountStr === "¾") amount = 0.75;
    else if (amountStr === "⅓") amount = 0.33;
    else if (amountStr === "⅔") amount = 0.67;
    // Handle fraction strings
    else if (amountStr.includes("/")) {
      const [num, den] = amountStr.split("/").map(Number);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        amount = num / den;
      }
    } else {
      amount = parseFloat(amountStr);
    }

    if (!isNaN(amount!)) {
      return { amount, unit };
    }
  }

  return { amount: undefined, unit: undefined };
}

/**
 * Scale an ingredient entry based on scaleFactor and scaleBehavior.
 * Returns display string and optional warning.
 */
export function scaleIngredient(
  entry: IngredientEntry,
  scaleFactor: number
): ScaledIngredient {
  if (typeof entry === "string") {
    // Try to parse quantity from string
    const parsed = parseQuantityFromText(entry);
    if (parsed.amount !== undefined) {
      const scaledAmount = parsed.amount * scaleFactor;
      const display = formatQuantity(scaledAmount, parsed.unit);
      return { display: display || entry };
    }
    return { display: entry };
  }

  if (typeof entry !== "object" || entry === null) {
    return { display: "" };
  }

  // Skip subsection entries (they should be handled by flattenIngredientEntries)
  if (isIngredientSubsection(entry)) {
    return { display: "" };
  }

  // At this point, entry is an ingredient object
  const ing = entry as {
    item?: string;
    name?: string;
    quantity?: number | string;
    amount?: number | string;
    unit?: string;
    scaleBehavior?: string;
    scaling?: { type?: string };
    [key: string]: unknown;
  };

  // Get scale behavior
  const scaleBehavior =
    ing.scaleBehavior ||
    ing.scaling?.type ||
    "linear";

  // Get quantity
  const quantity = ing.quantity ?? ing.amount;
  const unit = ing.unit;
  const itemText = ing.item ?? ing.name ?? "";

  // If no quantity, just return the item text
  if (quantity === undefined || quantity === null) {
    return { display: itemText || "" };
  }

  let scaledQuantity: number | string;
  let warning: string | undefined;

  // Convert quantity to number if it's a string
  let quantityNum: number;
  if (typeof quantity === "string") {
    const parsed = parseQuantityFromText(quantity);
    if (parsed.amount !== undefined) {
      quantityNum = parsed.amount;
      // Use parsed unit if entry doesn't have one
      const effectiveUnit = unit || parsed.unit;
      if (scaleBehavior === "fixed" || scaleBehavior === "taste") {
        return {
          display: formatQuantity(quantityNum, effectiveUnit) + (itemText ? ` ${itemText}` : ""),
          warning: scaleBehavior === "taste" ? "Scale to taste" : "May not scale linearly",
        };
      }

      // Apply scaling
      if (scaleBehavior === "sublinear") {
        scaledQuantity = quantityNum * Math.sqrt(scaleFactor);
      } else if (scaleBehavior === "stepped") {
        // Round to sensible steps (0.25, 0.5, 0.75, 1, 1.5, 2, etc.)
        const scaled = quantityNum * scaleFactor;
        if (scaled < 0.5) {
          scaledQuantity = Math.round(scaled * 4) / 4; // Round to 0.25 increments
        } else if (scaled < 2) {
          scaledQuantity = Math.round(scaled * 2) / 2; // Round to 0.5 increments
        } else {
          scaledQuantity = Math.round(scaled); // Round to whole numbers
        }
      } else {
        // linear
        scaledQuantity = quantityNum * scaleFactor;
      }

      const display = formatQuantity(scaledQuantity, effectiveUnit) + (itemText ? ` ${itemText}` : "");
      return { display, warning };
    }
    // Couldn't parse, return as-is
    return { display: itemText || quantity };
  } else {
    quantityNum = quantity;
  }

  // Apply scaling based on behavior
  if (scaleBehavior === "fixed" || scaleBehavior === "taste") {
    return {
      display: formatQuantity(quantityNum, unit) + (itemText ? ` ${itemText}` : ""),
      warning: scaleBehavior === "taste" ? "Scale to taste" : "May not scale linearly",
    };
  }

  if (scaleBehavior === "sublinear") {
    scaledQuantity = quantityNum * Math.sqrt(scaleFactor);
  } else if (scaleBehavior === "stepped") {
    // Round to sensible steps
    const scaled = quantityNum * scaleFactor;
    if (scaled < 0.5) {
      scaledQuantity = Math.round(scaled * 4) / 4;
    } else if (scaled < 2) {
      scaledQuantity = Math.round(scaled * 2) / 2;
    } else {
      scaledQuantity = Math.round(scaled);
    }
  } else {
    // linear
    scaledQuantity = quantityNum * scaleFactor;
  }

  const display = formatQuantity(scaledQuantity, unit) + (itemText ? ` ${itemText}` : "");
  return { display, warning };
}

/**
 * Get servings amount from recipe (supports multiple field names).
 */
export function getServingsAmount(recipe: unknown): number {
  if (typeof recipe !== "object" || recipe === null) {
    return 1;
  }

  const r = recipe as Record<string, unknown>;
  const servings =
    (typeof r.servings === "object" && r.servings !== null
      ? (r.servings as { amount?: number }).amount
      : undefined) ??
    (typeof r.servings === "number" ? r.servings : undefined) ??
    (typeof r.yield === "object" && r.yield !== null
      ? (r.yield as { servings?: number; amount?: number }).servings ??
        (r.yield as { servings?: number; amount?: number }).amount
      : undefined) ??
    (typeof r.yield === "number" ? r.yield : undefined);

  return typeof servings === "number" && servings > 0 ? servings : 1;
}

export { MIN_SERVINGS };

/**
 * Normalize soustack schema format to component format.
 * Converts section/ingredients to subsection/items and merges metadata.
 */
export function normalizeSoustackIngredients(
  ingredients: unknown,
  metadata?: {
    ingredientMetadata?: Record<string, Record<number, Record<string, unknown>>>;
  }
): IngredientEntry[] {
  if (!Array.isArray(ingredients)) {
    return [];
  }

  return ingredients.map((section) => {
    if (typeof section !== "object" || section === null) {
      return section as IngredientEntry;
    }

    const sect = section as Record<string, unknown>;
    
    // Check if it's soustack schema format (section + ingredients)
    if ("section" in sect && "ingredients" in sect && Array.isArray(sect.ingredients)) {
      const sectionName = String(sect.section);
      const sectionIngredients = sect.ingredients as Array<Record<string, unknown>>;
      
      // Merge metadata into each ingredient
      const items = sectionIngredients.map((ing, index) => {
        const ingMetadata = metadata?.ingredientMetadata?.[sectionName]?.[index] || {};
        return { ...ing, ...ingMetadata };
      });

      return {
        subsection: sectionName,
        items: items as IngredientEntry[]
      };
    }

    // Already in component format or plain entry
    return section as IngredientEntry;
  });
}

/**
 * Normalize soustack schema format to component format.
 * Converts section/steps to subsection/items and merges metadata.
 */
export function normalizeSoustackInstructions(
  instructions: unknown,
  metadata?: {
    instructionMetadata?: Record<string, Record<number, Record<string, unknown>>>;
  }
): InstructionEntry[] {
  if (!Array.isArray(instructions)) {
    return [];
  }

  return instructions.map((section) => {
    if (typeof section !== "object" || section === null) {
      return section as InstructionEntry;
    }

    const sect = section as Record<string, unknown>;
    
    // Check if it's soustack schema format (section + steps)
    if ("section" in sect && "steps" in sect && Array.isArray(sect.steps)) {
      const sectionName = String(sect.section);
      const sectionSteps = sect.steps as Array<string | Record<string, unknown>>;
      
      // Merge metadata into each step
      const items = sectionSteps.map((step, index) => {
        const stepMetadata = metadata?.instructionMetadata?.[sectionName]?.[index] || {};
        
        if (typeof step === "string") {
          return { step, ...stepMetadata };
        }
        
        return { ...step, ...stepMetadata };
      });

      return {
        subsection: sectionName,
        items: items as InstructionEntry[]
      };
    }

    // Already in component format or plain entry
    return section as InstructionEntry;
  });
}

