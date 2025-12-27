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

const renderSectionList = (
  title: string,
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
    return html`<section class="recipe-section">
      <h3 class="section-title">${title}</h3>
      <p class="empty">${emptyMessage}</p>
    </section>`;
  }

  return html`<section class="recipe-section">
    <h3 class="section-title">${title}</h3>
    ${normalizedSections.map(
      (section) => html`<div class="subsection">
        ${section.title ? html`<label class="subsection-label">${section.title}</label>` : null}
        <ul class="items">
          ${section.items.map((item) => html`<li>${item}</li>`)}
        </ul>
      </div>`
    )}
  </section>`;
};

export class SoustackRecipe extends LitElement {
  static styles = [
    soustackTokens,
    css`
      :host {
        display: block;
        max-width: 720px;
        font-family: var(--soustack-font-sans);
        font-size: var(--soustack-font-size-base);
        line-height: var(--soustack-line-height);
      }

      .recipe-card {
        border: 1px solid var(--soustack-border);
        border-radius: var(--soustack-radius);
        background: var(--soustack-card-bg);
        color: var(--soustack-text);
        padding: var(--soustack-space-3);
        box-shadow: var(--soustack-shadow);
        transition: box-shadow 0.2s ease;
      }

      .recipe-card:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .recipe-header {
        margin-bottom: var(--soustack-space-3);
      }

      .recipe-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--soustack-text);
        line-height: 1.2;
      }

      .recipe-section {
        margin-bottom: var(--soustack-space-3);
      }

      .recipe-section:last-child {
        margin-bottom: 0;
      }

      .section-title {
        margin: 0 0 0.75rem;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--soustack-text);
        line-height: 1.3;
      }

      .subsection {
        margin-bottom: var(--soustack-space-2);
      }

      .subsection:last-child {
        margin-bottom: 0;
      }

      .subsection-label {
        display: block;
        margin-bottom: var(--soustack-space-1);
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--soustack-text-muted);
      }

      .items {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--soustack-space-1);
      }

      .items li {
        line-height: var(--soustack-line-height);
      }

      .empty {
        color: var(--soustack-text-muted);
        font-style: italic;
        margin: 0;
      }
    `,
  ];

  @property({ attribute: false })
  recipe: unknown;

  render(): TemplateResult {
    const recipe = this.recipe;
    const name = getRecipeName(recipe) || "Recipe";
    const ingredients = getIngredientSections(recipe);
    const instructions = getInstructionSections(recipe);
    const stacks = getDeclaredStacksList(recipe);
    const stackSections = stacks.length > 0 ? [{ items: stacks }] : [];

    return html`
      <div class="recipe-card">
        <header class="recipe-header">
          <h2 class="recipe-title">${name}</h2>
        </header>
        ${renderSectionList("Ingredients", ingredients, "No ingredients provided.")}
        ${renderSectionList("Instructions", instructions, "No instructions provided.")}
        ${renderSectionList("Stacks", stackSections, "No stacks declared.")}
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
