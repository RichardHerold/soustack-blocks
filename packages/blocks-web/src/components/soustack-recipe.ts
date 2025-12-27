import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  getDeclaredStacksList,
  getIngredientSections,
  getInstructionSections,
  getRecipeName,
  type RecipeSection,
} from "@soustack/blocks-core";

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

@customElement("soustack-recipe")
export class SoustackRecipe extends LitElement {
  static styles = css`
    :host {
      --soustack-accent: #3b82f6;
      --soustack-border: #e5e7eb;
      --soustack-card-bg: #ffffff;
      --soustack-text: #1f2933;
      --soustack-text-muted: #6b7280;
      --soustack-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

      display: block;
      max-width: 720px;
    }

    .recipe-card {
      border: 1px solid var(--soustack-border);
      border-radius: 12px;
      background: var(--soustack-card-bg);
      color: var(--soustack-text);
      padding: 1.5rem;
      box-shadow: var(--soustack-shadow);
      transition: box-shadow 0.2s ease;
    }

    .recipe-card:hover {
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .recipe-header {
      margin-bottom: 1.5rem;
    }

    .recipe-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--soustack-text);
    }

    .recipe-section {
      margin-bottom: 1.5rem;
    }

    .recipe-section:last-child {
      margin-bottom: 0;
    }

    .section-title {
      margin: 0 0 0.75rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--soustack-text);
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
      letter-spacing: 0.05em;
      color: var(--soustack-text-muted);
    }

    .items {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .items li {
      line-height: 1.6;
    }

    .empty {
      color: var(--soustack-text-muted);
      font-style: italic;
      margin: 0;
    }
  `;

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

declare global {
  interface HTMLElementTagNameMap {
    "soustack-recipe": SoustackRecipe;
  }
}
