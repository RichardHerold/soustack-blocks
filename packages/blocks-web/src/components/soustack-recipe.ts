import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import {
  getDeclaredStacksList,
  getIngredientSections,
  getInstructionSections,
  getRecipeName,
  type RecipeSection,
} from "@soustack/blocks-core";
import { soustackTokens } from "../styles/tokens.js";

const renderIngredients = (
  sections: RecipeSection[],
  emptyMessage: string
): TemplateResult => {
  const normalizedSections = sections
    .map((section) => ({
      title: section.title,
      items: section.items.filter(Boolean),
    }))
    .filter((section) => section.items.length > 0 || section.title);

  if (normalizedSections.length === 0) {
    return html`<div class="ingredients-column">
      <h3 class="column-title">Ingredients</h3>
      <p class="empty">${emptyMessage}</p>
    </div>`;
  }
  
  return html`<div class="ingredients-column">
    <h3 class="column-title">Ingredients</h3>
    ${normalizedSections.map(
      (section) => html`<div class="subsection">
        ${section.title ? html`<label class="subsection-label">${section.title}</label>` : null}
        <ul class="ingredient-list">
          ${section.items.map((item) => html`<li class="ingredient-item">${item}</li>`)}
        </ul>
      </div>`
    )}
  </div>`;
};

const renderInstructions = (
  sections: RecipeSection[],
  emptyMessage: string,
  isPrep: boolean = false
): TemplateResult => {
  const normalizedSections = sections
    .map((section) => ({
      title: section.title,
      items: section.items.filter(Boolean),
    }))
    .filter((section) => section.items.length > 0 || section.title);

  if (normalizedSections.length === 0) {
    return html`<div class="${isPrep ? 'prep-column' : 'instructions-column'}">
      <h3 class="column-title">${isPrep ? 'Prep' : 'Directions'}</h3>
      <p class="empty">${emptyMessage}</p>
    </div>`;
  }

  return html`<div class="${isPrep ? 'prep-column' : 'instructions-column'}">
    <h3 class="column-title">${isPrep ? 'Prep' : 'Directions'}</h3>
    ${normalizedSections.map(
      (section) => html`<div class="subsection">
        ${section.title && !isPrep ? html`<label class="subsection-label">${section.title}</label>` : null}
        <ol class="instruction-list">
          ${section.items.map((item) => html`<li class="instruction-item">${item}</li>`)}
        </ol>
      </div>`
    )}
  </div>`;
};

export class SoustackRecipe extends LitElement {
  static styles = [
    soustackTokens,
    css`
      :host {
        display: block;
        width: 100%;
        max-width: 100%;
        font-family: var(--soustack-font-sans);
        font-size: var(--soustack-font-size-base);
        line-height: var(--soustack-line-height);
      }

      .recipe-card {
        border: 2px solid #d1d5db;
        border-radius: 4px;
        background: #fefefe;
        color: var(--soustack-text);
        padding: 1.25rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
        transition: box-shadow 0.2s ease, transform 0.2s ease;
        position: relative;
      }

      .recipe-card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px);
      }

      .recipe-header {
        margin-bottom: 1rem;
        padding: 0.75rem 1rem;
        border: 2px solid #ff6b35;
        border-radius: 3px;
        background: #fff;
        position: relative;
      }

      .recipe-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        font-family: Georgia, "Times New Roman", serif;
        font-style: italic;
        color: var(--soustack-text);
        line-height: 1.3;
      }

      .recipe-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-top: 0;
      }

      /* NYTimes Cooking-inspired breakpoints */
      /* Large tablets and small desktops: maintain two columns but reduce gap */
      @media (max-width: 1024px) {
        .recipe-content {
          gap: var(--soustack-space-2);
        }
      }

      /* Tablets and narrow screens: switch to single column layout */
      /* Stack: Ingredients → Prep → Directions */
      @media (max-width: 900px) {
        .recipe-content {
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        .ingredients-column {
          order: 1;
        }

        .prep-column {
          order: 2;
        }

        .instructions-column {
          order: 3;
        }
      }

      /* Mobile: single column with adjusted spacing */
      @media (max-width: 600px) {
        .recipe-card {
          padding: 1rem;
        }

        .recipe-content {
          gap: 1rem;
        }

        .recipe-header {
          padding: 0.625rem 0.875rem;
        }

        .recipe-title {
          font-size: 1.375rem;
        }

        .column-title {
          font-size: 0.8125rem;
        }
      }

      .ingredients-column,
      .instructions-column,
      .prep-column {
        display: flex;
        flex-direction: column;
      }

      .column-title {
        margin: 0 0 0.75rem;
        font-size: 1rem;
        font-weight: 700;
        color: var(--soustack-text);
        line-height: 1.3;
        font-family: Georgia, "Times New Roman", serif;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.875rem;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 0.5rem;
      }

      .subsection {
        margin-bottom: 1rem;
      }

      .subsection:last-child {
        margin-bottom: 0;
      }

      .subsection-label {
        display: block;
        margin-bottom: 0.5rem;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--soustack-text-muted);
        font-family: var(--soustack-font-sans);
      }

      .ingredient-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .ingredient-item {
        line-height: 1.5;
        font-size: 0.9375rem;
      }

      .instruction-list {
        list-style: none;
        counter-reset: step-counter;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.875rem;
      }

      .instruction-item {
        counter-increment: step-counter;
        position: relative;
        padding-left: 2.25rem;
        line-height: 1.5;
        min-height: 1.5rem;
        font-size: 0.9375rem;
      }

      .instruction-item::before {
        content: counter(step-counter);
        position: absolute;
        left: 0;
        top: 0;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ff6b35;
        color: white;
        border-radius: 50%;
        font-weight: 600;
        font-size: 0.8125rem;
        flex-shrink: 0;
      }

      .empty {
        color: var(--soustack-text-muted);
        font-style: italic;
        margin: 0;
      }

      .stacks-section {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
      }
    `,
  ];

  @property({ attribute: false })
  recipe: unknown;

  render(): TemplateResult {
    const recipe = this.recipe;
    const name = getRecipeName(recipe) || "Recipe";
    const ingredients = getIngredientSections(recipe);
    const allInstructions = getInstructionSections(recipe);
    
    // Separate prep sections from other instructions
    const prepSections = allInstructions.filter(
      (section) => section.title?.toLowerCase() === "prep" || section.title?.toLowerCase() === "preparation"
    );
    const directionsSections = allInstructions.filter(
      (section) => section.title?.toLowerCase() !== "prep" && section.title?.toLowerCase() !== "preparation"
    );
    
    const stacks = getDeclaredStacksList(recipe);
    const stackSections = stacks.length > 0 ? [{ items: stacks }] : [];

    return html`
      <div class="recipe-card">
        <header class="recipe-header">
          <h2 class="recipe-title">${name}</h2>
        </header>
        <div class="recipe-content">
          ${renderIngredients(ingredients, "No ingredients provided.")}
          ${prepSections.length > 0 ? renderInstructions(prepSections, "No prep steps provided.", true) : null}
          ${renderInstructions(directionsSections, "No instructions provided.", false)}
        </div>
        ${stacks.length > 0 ? html`<div class="stacks-section">
          <h3 class="column-title">Stacks</h3>
          <ul class="ingredient-list">
            ${stacks.map((stack) => html`<li class="ingredient-item">${stack}</li>`)}
          </ul>
        </div>` : null}
      </div>
    `;
  }
}

// Register the custom element with error handling for HMR/reload scenarios
// Always use try-catch since customElements.get() check can have race conditions
const elementName = "soustack-recipe";

try {
  customElements.define(elementName, SoustackRecipe);
} catch (error) {
  // Element already defined (can happen with HMR or multiple module loads)
  // This is expected and safe to ignore
}

declare global {
  interface HTMLElementTagNameMap {
    "soustack-recipe": SoustackRecipe;
  }
}
