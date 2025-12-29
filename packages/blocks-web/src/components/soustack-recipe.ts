import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  getDeclaredStacksList,
  getIngredientSections,
  getInstructionSections,
  getRecipeName,
  hasInstructionParagraphs,
  getInstructionParagraphs,
  type RecipeSection,
} from "@soustack/blocks-core";
import { soustackTokens } from "../styles/tokens.js";

const normalizeSections = (sections: RecipeSection[]): RecipeSection[] =>
  sections
    .map((section) => ({
      title: section.title,
      items: section.items.filter(Boolean),
    }))
    .filter((section) => section.items.length > 0 || section.title);

const renderSectionBody = (
  normalizedSections: RecipeSection[],
  emptyMessage: string
): TemplateResult => {
  if (normalizedSections.length === 0) {
    return html`<p class="empty">${emptyMessage}</p>`;
  }

  return html`${normalizedSections.map(
    (section) => html`<div class="subsection">
      ${section.title ? html`<label class="subsection-label">${section.title}</label>` : null}
      <ul class="items">
        ${section.items.map((item) => html`<li>${item}</li>`)}
      </ul>
    </div>`
  )}`;
};

const renderSectionList = (
  title: string,
  sections: RecipeSection[],
  emptyMessage: string
): TemplateResult => {
  const normalizedSections = normalizeSections(sections);

  return html`<section class="recipe-section">
    <h3 class="section-title">${title}</h3>
    ${renderSectionBody(normalizedSections, emptyMessage)}
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

      .section-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--soustack-space-2);
        flex-wrap: wrap;
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

      .instruction-toggle {
        display: inline-flex;
        align-items: center;
        gap: var(--soustack-space-1);
        background: var(--soustack-surface-muted, rgba(0, 0, 0, 0.03));
        padding: 4px;
        border-radius: 999px;
      }

      .instruction-toggle button {
        border: 1px solid transparent;
        border-radius: 999px;
        background: transparent;
        color: var(--soustack-text);
        font-size: 0.875rem;
        padding: 0.35rem 0.75rem;
        cursor: pointer;
        transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
      }

      .instruction-toggle button:hover {
        background: rgba(0, 0, 0, 0.04);
      }

      .instruction-toggle button.active {
        background: var(--soustack-accent, #2563eb);
        color: #ffffff;
        border-color: var(--soustack-accent, #2563eb);
      }

      .instruction-paragraphs {
        display: flex;
        flex-direction: column;
        gap: var(--soustack-space-2);
        margin: 0;
      }

      .instruction-paragraph {
        margin: 0;
        line-height: var(--soustack-line-height);
        color: var(--soustack-text);
        word-break: break-word;
      }
    `,
  ];

  @property({ attribute: false })
  recipe: unknown;

  @state()
  private instructionMode: "steps" | "paragraphs" = "steps";

  protected updated(changedProperties: Map<string, unknown>): void {
    if (
      changedProperties.has("recipe") &&
      this.instructionMode === "paragraphs" &&
      !hasInstructionParagraphs(this.recipe)
    ) {
      this.instructionMode = "steps";
    }
  }

  private renderInstructionHeader(hasParagraphs: boolean): TemplateResult {
    return html`<div class="section-header">
      <h3 class="section-title">Instructions</h3>
      ${hasParagraphs
        ? html`<div class="instruction-toggle" @click=${(event: Event) => event.stopPropagation()}>
            <button
              class=${this.instructionMode === "steps" ? "active" : ""}
              type="button"
              @click=${(event: Event) => this.setInstructionMode(event, "steps")}
            >
              Steps
            </button>
            <button
              class=${this.instructionMode === "paragraphs" ? "active" : ""}
              type="button"
              @click=${(event: Event) => this.setInstructionMode(event, "paragraphs")}
            >
              Paragraphs
            </button>
          </div>`
        : null}
    </div>`;
  }

  private setInstructionMode(event: Event, mode: "steps" | "paragraphs"): void {
    event.stopPropagation();
    this.instructionMode = mode;
  }

  private renderInstructionParagraphs(paragraphs: string[]): TemplateResult {
    const hasParagraphs = hasInstructionParagraphs(this.recipe);
    return html`<div class="recipe-section instructions-section">
      ${this.renderInstructionHeader(hasParagraphs)}
      ${paragraphs.length === 0
        ? html`<p class="empty">No instructions provided.</p>`
        : html`<div class="instruction-paragraphs">
            ${paragraphs.map(
              (paragraph) => html`<p class="instruction-paragraph">${paragraph}</p>`
            )}
          </div>`}
    </div>`;
  }

  private renderInstructionSteps(sections: RecipeSection[]): TemplateResult {
    const hasParagraphs = hasInstructionParagraphs(this.recipe);
    const normalizedSections = normalizeSections(sections);
    return html`<div class="recipe-section instructions-section">
      ${this.renderInstructionHeader(hasParagraphs)}
      ${renderSectionBody(normalizedSections, "No instructions provided.")}
    </div>`;
  }

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
        ${this.instructionMode === "paragraphs"
          ? this.renderInstructionParagraphs(getInstructionParagraphs(recipe))
          : this.renderInstructionSteps(instructions)}
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
