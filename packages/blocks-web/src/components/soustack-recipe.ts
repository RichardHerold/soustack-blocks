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
    return html`<section>
      <h3>${title}</h3>
      <p class="empty">${emptyMessage}</p>
    </section>`;
  }

  return html`<section>
    <h3>${title}</h3>
    ${normalizedSections.map(
      (section) => html`<div class="subsection">
        ${section.title ? html`<h4>${section.title}</h4>` : null}
        <ul>
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
      display: block;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      background: #ffffff;
      color: #1f2933;
      max-width: 720px;
    }

    h2 {
      margin: 0 0 1rem;
      font-size: 1.5rem;
      font-weight: 600;
    }

    section {
      margin-bottom: 1.25rem;
    }

    .subsection h4 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .subsection ul {
      margin: 0;
      padding-left: 1.25rem;
    }

    .empty {
      color: #6b7280;
      font-style: italic;
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
      <article>
        <h2>${name}</h2>
        ${renderSectionList("Ingredients", ingredients, "No ingredients provided.")}
        ${renderSectionList("Instructions", instructions, "No instructions provided.")}
        ${renderSectionList("Stacks", stackSections, "No stacks declared.")}
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "soustack-recipe": SoustackRecipe;
  }
}
