const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toTrimmedStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const extractInstructionText = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value;
  }

  if (isRecord(value)) {
    if (typeof value.text === "string") {
      return value.text;
    }

    if (typeof value.step === "string") {
      return value.step;
    }

    if (typeof value.description === "string") {
      return value.description;
    }
  }

  return undefined;
};

export const getInstructionSteps = (recipe: unknown): string[] => {
  if (!isRecord(recipe)) {
    return [];
  }

  const { instructions } = recipe;

  if (Array.isArray(instructions)) {
    return instructions
      .map((entry) => extractInstructionText(entry))
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  if (typeof instructions === "string") {
    return instructions
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  return [];
};

const getMetadataInstructionParagraphs = (recipe: unknown): string[] => {
  if (!isRecord(recipe)) {
    return [];
  }

  const { metadata } = recipe;
  if (!isRecord(metadata)) {
    return [];
  }

  return toTrimmedStringArray(metadata.instructionParagraphs);
};

export const getInstructionParagraphs = (recipe: unknown): string[] => {
  const metadataParagraphs = getMetadataInstructionParagraphs(recipe);
  if (metadataParagraphs.length > 0) {
    return metadataParagraphs;
  }

  const steps = getInstructionSteps(recipe);
  return steps
    .flatMap((step) => step.split(/\n\s*\n/))
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};

export const hasInstructionParagraphs = (recipe: unknown): boolean =>
  getMetadataInstructionParagraphs(recipe).length > 0;
