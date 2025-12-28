// Recipe fixture for soustack-recipe-card
export const interactiveRecipeFixture = {
  name: "Classic Chocolate Chip Cookies",
  servings: { amount: 24 },
  equipment: [
    "Stand mixer or hand mixer",
    "Large mixing bowl",
    "Baking sheets",
    "Parchment paper",
    "Wire cooling rack"
  ],
  ingredients: [
    {
      subsection: "Dry Ingredients",
      items: [
        { name: "All-purpose flour", quantity: 2.5, unit: "cups", scaleBehavior: "linear" },
        { name: "Baking soda", quantity: 1, unit: "teaspoon", scaleBehavior: "linear" },
        { name: "Salt", quantity: 1, unit: "teaspoon", scaleBehavior: "taste" }
      ]
    },
    {
      subsection: "Wet Ingredients",
      items: [
        { name: "Unsalted butter", quantity: 1, unit: "cup", scaleBehavior: "linear", prepAction: "Melt", prep: "Melted and cooled" },
        { name: "Brown sugar", quantity: 0.75, unit: "cup", scaleBehavior: "linear", prepAction: "Measure" },
        { name: "Granulated sugar", quantity: 0.75, unit: "cup", scaleBehavior: "linear", prepAction: "Measure" },
        { name: "Large eggs", quantity: 2, scaleBehavior: "stepped" },
        { name: "Vanilla extract", quantity: 2, unit: "teaspoons", scaleBehavior: "taste" }
      ]
    },
    {
      subsection: "Mix-ins",
      items: [
        { name: "Chocolate chips", quantity: 2, unit: "cups", scaleBehavior: "linear", prepAction: "Measure", destination: "Mixing bowl" },
        { name: "Chopped walnuts", quantity: 1, unit: "cup", scaleBehavior: "linear", prepAction: "Chop", prep: "Roughly chopped" }
      ]
    }
  ],
  instructions: [
    {
      subsection: "Preparation",
      items: [
        "Preheat oven to 375°F (190°C).",
        "Line baking sheets with parchment paper."
      ]
    },
    {
      subsection: "Mixing",
      items: [
        {
          step: "In a medium bowl, whisk together flour, baking soda, and salt. Set aside.",
          scaleAdjustment: {
            trigger: 2,
            note: "When doubling, mix dry ingredients in a large bowl to accommodate increased volume."
          }
        },
        "In a large bowl, cream together melted butter, brown sugar, and granulated sugar until well combined.",
        "Beat in eggs one at a time, then stir in vanilla extract.",
        "Gradually blend in the flour mixture until just combined.",
        "Fold in chocolate chips and walnuts."
      ]
    },
    {
      subsection: "Baking",
      items: [
        "Drop rounded tablespoons of dough onto prepared baking sheets, spacing about 2 inches apart.",
        "Bake for 9-11 minutes, or until edges are golden but centers are still soft.",
        "Cool on baking sheet for 5 minutes before transferring to wire rack to cool completely."
      ]
    }
  ],
  time: {
    prep: "15 minutes",
    cook: "11 minutes per batch",
    total: "About 1 hour (including cooling)"
  },
  scaleWarnings: [
    "When scaling up significantly, you may need to bake in multiple batches.",
    "Butter quantity scales linearly, but melting time may vary."
  ]
};
