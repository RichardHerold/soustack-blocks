import "@soustack/blocks-web";

/**
 * Design Sandbox for <soustack-recipe> component
 * 
 * This file provides fast-iteration testing for recipe card designs.
 * 
 * To add more fixtures:
 * - Add new recipe objects to the fixtures array below
 * - Follow the RecipeLike structure: { name, ingredients, instructions, stacks? }
 * 
 * To customize theming:
 * - Modify CSS variables in the frame containers (e.g., --soustack-accent, --soustack-card-bg)
 * - See packages/blocks-web/src/styles/tokens.ts for available tokens
 */

// Simple recipe fixture: short title, minimal content
const simpleRecipe = {
  name: "Quick Toast",
  ingredients: [
    "2 slices bread",
    "Butter",
    "Jam"
  ],
  instructions: [
    "Toast the bread",
    "Spread butter and jam"
  ],
  stacks: {
    quantified: { version: { major: 1 } }
  }
};

// Long recipe fixture: long title, many ingredients and steps
const longRecipe = {
  name: "Traditional Italian Pasta Carbonara with Homemade Pasta and Fresh Herbs",
  ingredients: [
    "500g all-purpose flour",
    "5 large eggs",
    "200g guanciale, diced",
    "200g Pecorino Romano, grated",
    "4 large egg yolks",
    "Freshly ground black pepper",
    "1 tsp salt",
    "2 cloves garlic, minced",
    "Fresh parsley, chopped",
    "Fresh basil, chopped",
    "Extra virgin olive oil",
    "White wine (optional)",
    "Parmesan cheese for serving",
    "Red pepper flakes",
    "Lemon zest"
  ],
  instructions: [
    "Make a well with the flour on a clean surface",
    "Crack eggs into the center of the well",
    "Gradually incorporate flour into eggs using a fork",
    "Knead the dough for 10 minutes until smooth",
    "Wrap in plastic and rest for 30 minutes",
    "Roll out pasta dough to desired thickness",
    "Cut into fettuccine or spaghetti shapes",
    "Bring a large pot of salted water to boil",
    "Cook guanciale in a large pan until crispy",
    "Remove guanciale and set aside, reserve fat",
    "Cook pasta until al dente",
    "Reserve 1 cup pasta water",
    "Whisk egg yolks with grated Pecorino",
    "Add hot pasta to pan with guanciale fat",
    "Remove from heat and quickly toss with egg mixture",
    "Add pasta water gradually to create creamy sauce",
    "Season with black pepper and serve immediately"
  ],
  stacks: {
    quantified: { version: { major: 2 } },
    scaling: { major: 1 }
  }
};

// Multi-section recipe: ingredients and instructions split into sections
const multiSectionRecipe = {
  name: "Layered Cake",
  ingredients: [
    {
      section: "Cake Base",
      ingredients: [
        "2 cups flour",
        "1 cup sugar",
        "3 eggs",
        "1/2 cup butter"
      ]
    },
    {
      section: "Frosting",
      ingredients: [
        "1 cup cream cheese",
        "1/2 cup powdered sugar",
        "1 tsp vanilla"
      ]
    },
    {
      section: "Decoration",
      ingredients: [
        "Fresh berries",
        "Chocolate shavings"
      ]
    }
  ],
  instructions: [
    {
      section: "Prepare Cake",
      steps: [
        "Mix dry ingredients",
        "Beat eggs and butter",
        "Combine wet and dry",
        "Bake at 350°F for 30 minutes"
      ]
    },
    {
      section: "Assemble",
      steps: [
        "Let cake cool completely",
        "Prepare frosting",
        "Frost the cake",
        "Add decorations"
      ]
    }
  ],
  stacks: {
    structured: { quantity: 1 }
  }
};

// Edge case: minimal/empty content
const minimalRecipe = {
  name: "Water",
  ingredients: [],
  instructions: [
    "Pour water into a glass"
  ],
  stacks: {}
};

// All fixtures for iteration
const fixtures = [simpleRecipe, longRecipe, multiSectionRecipe, minimalRecipe];

/**
 * Renders the design sandbox into a container element.
 * Shows recipe cards in different layout scenarios for design iteration.
 */
export function renderDesignSandbox(container: HTMLElement): void {
  container.innerHTML = `
    <style>
      .design-sandbox {
        padding: 2rem 1rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .sandbox-header {
        margin-bottom: 2rem;
      }

      .sandbox-header h2 {
        margin: 0 0 0.5rem;
        font-size: 2rem;
        font-weight: 700;
      }

      .sandbox-header p {
        margin: 0;
        color: #6b7280;
      }

      .frames-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
      }

      .frame {
        display: flex;
        flex-direction: column;
      }

      .frame-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .frame-content {
        border: 1px dashed #d1d5db;
        border-radius: 8px;
        padding: 1rem;
        background: #f9fafb;
      }

      .frame-content.narrow {
        max-width: 320px;
      }

      .frame-content.wide {
        max-width: 900px;
      }

      .frame-content.themed {
        /* Theme overrides applied via inline style */
      }

      .frame-content.dark {
        background: #1f2937;
        border-color: #4b5563;
      }

      .frame-content.dark .frame-label {
        color: #f3f4f6;
      }

      .recipe-showcase {
        margin-top: 3rem;
      }

      .recipe-showcase h3 {
        margin: 0 0 1rem;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .recipe-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .recipe-item {
        border: 1px dashed #d1d5db;
        border-radius: 8px;
        padding: 1rem;
        background: #ffffff;
      }

      .recipe-item-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #6b7280;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    </style>

    <div class="design-sandbox">
      <div class="sandbox-header">
        <h2>Design Sandbox</h2>
        <p>Fast-iteration testing for recipe card designs. Edit fixtures in <code>design-sandbox.ts</code> and CSS variables for theming.</p>
      </div>

      <div class="frames-grid">
        <div class="frame">
          <div class="frame-label">Default</div>
          <div class="frame-content">
            <div id="frame-default"></div>
          </div>
        </div>

        <div class="frame">
          <div class="frame-label">Narrow (320px)</div>
          <div class="frame-content narrow">
            <div id="frame-narrow"></div>
          </div>
        </div>

        <div class="frame">
          <div class="frame-label">Wide (900px)</div>
          <div class="frame-content wide">
            <div id="frame-wide"></div>
          </div>
        </div>

        <div class="frame">
          <div class="frame-label">Themed</div>
          <div class="frame-content themed" style="--soustack-accent: #8b5cf6; --soustack-card-bg: #f3f4f6; --soustack-border: #cbd5e1; --soustack-text: #1e293b; --soustack-text-muted: #64748b;">
            <div id="frame-themed"></div>
          </div>
        </div>

        <div class="frame">
          <div class="frame-label">Dark Container</div>
          <div class="frame-content dark">
            <div id="frame-dark"></div>
          </div>
        </div>
      </div>

      <div class="recipe-showcase">
        <h3>All Fixtures</h3>
        <div class="recipe-grid">
          <div class="recipe-item">
            <div class="recipe-item-label">Simple</div>
            <div id="fixture-simple"></div>
          </div>
          <div class="recipe-item">
            <div class="recipe-item-label">Long</div>
            <div id="fixture-long"></div>
          </div>
          <div class="recipe-item">
            <div class="recipe-item-label">Multi-Section</div>
            <div id="fixture-multisection"></div>
          </div>
          <div class="recipe-item">
            <div class="recipe-item-label">Minimal</div>
            <div id="fixture-minimal"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render recipe cards in frames
  const renderRecipe = (recipe: unknown, containerId: string) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const recipeEl = document.createElement("soustack-recipe");
    (recipeEl as any).recipe = recipe;
    container.appendChild(recipeEl);
  };

  // Use the multi-section recipe for all frames (good for testing different layouts)
  const testRecipe = multiSectionRecipe;

  renderRecipe(testRecipe, "frame-default");
  renderRecipe(testRecipe, "frame-narrow");
  renderRecipe(testRecipe, "frame-wide");
  renderRecipe(testRecipe, "frame-themed");
  renderRecipe(testRecipe, "frame-dark");

  // Render all fixtures in showcase
  renderRecipe(fixtures[0], "fixture-simple");
  renderRecipe(fixtures[1], "fixture-long");
  renderRecipe(fixtures[2], "fixture-multisection");
  renderRecipe(fixtures[3], "fixture-minimal");
}

