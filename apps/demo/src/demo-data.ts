export const recipeFixture = {
  name: "Soustack Seed Recipe",
  profile: "scalable",
  stacks: {
    quantified: { version: { major: 2 } },
    scaling: { major: 1 },
    structured: { quantity: 1 }
  },
  metadata: {
    instructionParagraphs: [
      "This seeded loaf starts with a simple mix of flour and instant yeast before adding water to form a shaggy dough. A brief rest lets the flour hydrate and makes the dough easier to handle without extensive kneading.",
      "After a short bench rest, the dough is shaped, coated with olive oil, and finished with a pinch of salt. Bake until the crust is deeply golden and the interior is cooked through for a rustic, flavorful bread.",
      "Let the bread cool slightly before slicing to keep the crumb tender and the seeds evenly distributed across each slice."
    ]
  },
  ingredients: [
    {
      section: "Dough",
      ingredients: [
        { name: "Flour", quantity: 500 },
        { name: "Water", quantity: "320ml" },
        { name: "Instant yeast", amount: 5, description: "g" }
      ]
    },
    {
      section: "Finishing",
      ingredients: ["Olive oil", "Salt to taste"]
    }
  ],
  instructions: [
    {
      section: "Prep",
      steps: [
        "Combine flour and instant yeast in a large bowl.",
        "Pour in the water and mix until a shaggy dough forms.",
        "Cover and let the dough rest for 15 minutes to hydrate."
      ]
    },
    {
      section: "Bake",
      steps: [
        "Gently shape the dough into a round and place it on a lightly oiled pan.",
        "Brush or drizzle the top with olive oil and sprinkle salt to taste.",
        "Bake until the crust is golden and the loaf sounds hollow when tapped."
      ]
    }
  ]
};
