// Recipe fixture in soustack schema format
export const interactiveRecipeFixture = {
  $schema: "https://spec.soustack.dev/recipe.schema.json",
  profile: "scalable",
  name: "Classic Chocolate Chip Cookies",
  stacks: {
    quantified: { version: { major: 2 } },
    scaling: { major: 1 },
    structured: { quantity: 1 }
  },
  yield: { servings: 24 },
  ingredients: [
    {
      section: "Dry Ingredients",
      ingredients: [
        { name: "All-purpose flour", quantity: 2.5, unit: "cups" },
        { name: "Baking soda", quantity: 1, unit: "teaspoon" },
        { name: "Salt", quantity: 1, unit: "teaspoon" }
      ]
    },
    {
      section: "Wet Ingredients",
      ingredients: [
        { name: "Unsalted butter", quantity: 1, unit: "cup" },
        { name: "Brown sugar", quantity: 0.75, unit: "cup" },
        { name: "Granulated sugar", quantity: 0.75, unit: "cup" },
        { name: "Large eggs", quantity: 2 },
        { name: "Vanilla extract", quantity: 2, unit: "teaspoons" }
      ]
    },
    {
      section: "Mix-ins",
      ingredients: [
        { name: "Chocolate chips", quantity: 2, unit: "cups" },
        { name: "Chopped walnuts", quantity: 1, unit: "cup" }
      ]
    }
  ],
  instructions: [
    {
      section: "Preparation",
      steps: [
        "Preheat oven to 375°F (190°C).",
        "Line baking sheets with parchment paper."
      ]
    },
    {
      section: "Mixing",
      steps: [
        "In a medium bowl, whisk together flour, baking soda, and salt. Set aside.",
        "In a large bowl, cream together melted butter, brown sugar, and granulated sugar until well combined.",
        "Beat in eggs one at a time, then stir in vanilla extract.",
        "Gradually blend in the flour mixture until just combined.",
        "Fold in chocolate chips and walnuts."
      ]
    },
    {
      section: "Baking",
      steps: [
        "Drop rounded tablespoons of dough onto prepared baking sheets, spacing about 2 inches apart.",
        "Bake for 9-11 minutes, or until edges are golden but centers are still soft.",
        "Cool on baking sheet for 5 minutes before transferring to wire rack to cool completely."
      ]
    }
  ],
  metadata: {
    // Custom fields for interactive recipe card features
    equipment: [
      "Stand mixer or hand mixer",
      "Large mixing bowl",
      "Baking sheets",
      "Parchment paper",
      "Wire cooling rack"
    ],
    time: {
      prep: "15 minutes",
      cook: "11 minutes per batch",
      total: "About 1 hour (including cooling)"
    },
    scaleWarnings: [
      "When scaling up significantly, you may need to bake in multiple batches.",
      "Butter quantity scales linearly, but melting time may vary."
    ],
    // Ingredient-specific metadata (indexed by section and ingredient position)
    ingredientMetadata: {
      "Dry Ingredients": {
        0: { scaleBehavior: "linear" },
        1: { scaleBehavior: "linear" },
        2: { scaleBehavior: "taste" }
      },
      "Wet Ingredients": {
        0: { scaleBehavior: "linear", prepAction: "Melt", prep: "Melted and cooled" },
        1: { scaleBehavior: "linear", prepAction: "Measure" },
        2: { scaleBehavior: "linear", prepAction: "Measure" },
        3: { scaleBehavior: "stepped" },
        4: { scaleBehavior: "taste" }
      },
      "Mix-ins": {
        0: { scaleBehavior: "linear", prepAction: "Measure", destination: "Mixing bowl" },
        1: { scaleBehavior: "linear", prepAction: "Chop", prep: "Roughly chopped" }
      }
    },
    // Instruction-specific metadata (indexed by section and step position)
    instructionMetadata: {
      "Mixing": {
        0: {
          scaleAdjustment: {
            trigger: 2,
            note: "When doubling, mix dry ingredients in a large bowl to accommodate increased volume."
          }
        }
      }
    }
  }
};
