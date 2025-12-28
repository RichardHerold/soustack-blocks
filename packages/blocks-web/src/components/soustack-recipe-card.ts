import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import {
  getRecipeName,
  getServingsAmount,
  hasStack,
  MIN_SERVINGS,
  isIngredientSubsection,
  isInstructionSubsection,
  flattenIngredientEntries,
  extractIngredientText,
  extractInstructionText,
  scaleIngredient,
  type IngredientEntry,
  type InstructionEntry,
} from "@soustack/blocks-core";
import { soustackTokens } from "../styles/tokens.js";

type RecipeLike = {
  name?: string;
  title?: string;
  servings?: number | { amount?: number };
  yield?: number | { servings?: number; amount?: number };
  ingredients?: IngredientEntry[];
  instructions?: InstructionEntry[];
  equipment?: string[];
  scaleWarnings?: string[];
  time?: {
    prep?: number | string;
    cook?: number | string;
    total?: number | string;
  };
  [key: string]: unknown;
};

export class SoustackRecipeCard extends LitElement {
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
        border: 2px solid var(--soustack-border, #d1d5db);
        border-radius: var(--soustack-radius, 4px);
        background: var(--soustack-card-bg, #fefefe);
        color: var(--soustack-text);
        padding: 1.25rem;
        box-shadow: var(--soustack-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
        cursor: pointer;
        transition: box-shadow 0.2s ease, max-width 0.2s ease;
        max-width: 370px;
      }

      .recipe-card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .recipe-card.expanded {
        max-width: 100%;
      }

      .recipe-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        user-select: none;
        pointer-events: none;
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

      .expand-icon {
        display: none;
      }

      .recipe-content {
        display: none;
      }

      .recipe-content.expanded {
        display: block;
      }

      .recipe-card-collapsed-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        background: #f9fafb;
        border-radius: 3px;
        font-size: 0.875rem;
        color: var(--soustack-text-muted);
        user-select: none;
        pointer-events: none;
      }

      .recipe-card-collapsed-info.hidden {
        display: none;
      }

      .view-toggle {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid var(--soustack-border, #e5e7eb);
        padding-bottom: 0.75rem;
      }

      .view-toggle-button {
        padding: 0.5rem 1rem;
        border: 1px solid var(--soustack-border, #e5e7eb);
        background: #fff;
        color: var(--soustack-text);
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .view-toggle-button:hover {
        background: #f9fafb;
      }

      .view-toggle-button.active {
        background: #ff6b35;
        color: white;
        border-color: #ff6b35;
      }

      .servings-display {
        margin-bottom: 1rem;
        padding: 0.5rem 0;
        font-size: 0.9375rem;
        font-weight: 500;
        color: var(--soustack-text);
        text-align: left;
        border-bottom: 1px solid var(--soustack-border, #e5e7eb);
      }

      .scaling-controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        padding: 0.75rem;
        background: #f9fafb;
        border-radius: 4px;
      }

      .scaling-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--soustack-text);
      }

      .scaling-input {
        width: 4rem;
        height: 2rem;
        border: 1px solid var(--soustack-border, #e5e7eb);
        background: #fff;
        color: var(--soustack-text);
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 600;
        text-align: center;
        padding: 0 0.5rem;
        font-family: var(--soustack-font-sans);
      }

      .scaling-input:focus {
        outline: none;
        border-color: #ff6b35;
        box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
      }

      .scaling-multiplier {
        font-size: 1rem;
        font-weight: 600;
        color: var(--soustack-text-muted);
        margin: 0 0.25rem;
      }

      .scaling-servings {
        font-size: 0.875rem;
        color: var(--soustack-text-muted);
        margin-left: 0.5rem;
      }

      .scaling-button {
        width: 2rem;
        height: 2rem;
        border: 1px solid var(--soustack-border, #e5e7eb);
        background: #fff;
        color: var(--soustack-text);
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .scaling-button:hover:not(:disabled) {
        background: #f3f4f6;
        border-color: #d1d5db;
      }

      .scaling-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .scaling-quick-buttons {
        display: flex;
        gap: 0.5rem;
        margin-left: auto;
      }

      .scaling-quick-button {
        padding: 0.375rem 0.75rem;
        border: 1px solid var(--soustack-border, #e5e7eb);
        background: #fff;
        color: var(--soustack-text);
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.75rem;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .scaling-quick-button:hover {
        background: #f3f4f6;
      }

      .scale-warnings {
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: #fef3c7;
        border-left: 3px solid #f59e0b;
        border-radius: 4px;
      }

      .scale-warnings-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #92400e;
        margin-bottom: 0.5rem;
      }

      .scale-warnings-list {
        margin: 0;
        padding-left: 1.25rem;
        font-size: 0.875rem;
        color: #78350f;
      }

      .ingredients-section,
      .instructions-section {
        margin-bottom: 1.5rem;
      }

      .recipe-sections-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }

      @media (max-width: 800px) {
        .recipe-sections-container {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
      }

      .section-title {
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
        position: relative;
        padding-left: 1rem;
      }

      .ingredient-item::before {
        content: "—";
        position: absolute;
        left: 0;
        color: var(--soustack-text-muted);
      }

      .ingredient-item.has-warning {
        color: #dc2626;
      }

      .ingredient-warning {
        display: block;
        font-size: 0.75rem;
        font-style: italic;
        color: #dc2626;
        margin-top: 0.25rem;
        padding-left: 1rem;
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

      .instruction-scale-note {
        display: block;
        font-size: 0.75rem;
        font-style: italic;
        color: var(--soustack-text-muted);
        margin-top: 0.25rem;
        padding-left: 2.25rem;
      }

      .time-summary {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--soustack-border, #e5e7eb);
        font-size: 0.875rem;
        color: var(--soustack-text-muted);
      }

      .time-summary-item {
        margin-bottom: 0.25rem;
      }

      .mise-section {
        margin-bottom: 1.5rem;
      }

      .equipment-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .equipment-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        line-height: 1.5;
        font-size: 0.9375rem;
      }

      .equipment-checkbox {
        width: 1.25rem;
        height: 1.25rem;
        cursor: pointer;
      }

      .prep-tasks-group {
        margin-bottom: 1.5rem;
      }

      .prep-tasks-group:last-child {
        margin-bottom: 0;
      }

      .prep-tasks-title {
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--soustack-text);
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--soustack-border, #e5e7eb);
      }

      .prep-task-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .prep-task-item {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        line-height: 1.5;
        font-size: 0.9375rem;
      }

      .prep-task-checkbox {
        width: 1.25rem;
        height: 1.25rem;
        cursor: pointer;
        margin-top: 0.125rem;
        flex-shrink: 0;
      }

      .prep-task-content {
        flex: 1;
      }

      .prep-task-meta {
        display: block;
        font-size: 0.75rem;
        font-style: italic;
        color: var(--soustack-text-muted);
        margin-top: 0.25rem;
      }

      @media (max-width: 600px) {
        .recipe-card {
          padding: 1rem;
        }

        .recipe-title {
          font-size: 1.375rem;
        }

        .scaling-controls {
          flex-wrap: wrap;
        }

        .scaling-quick-buttons {
          width: 100%;
          margin-left: 0;
          margin-top: 0.5rem;
        }
      }
    `,
  ];

  @property({ attribute: false })
  recipe: unknown;

  @property({ type: Boolean, attribute: "expanded" })
  expanded = false;

  @state()
  private view: "cook" | "mise" | "scale" = "cook";

  @state()
  private scaleFactor = 1;

  @state()
  private scaleFactorInput = "1";

  private originalServings = 1;

  connectedCallback(): void {
    super.connectedCallback();
    if (this.recipe) {
      this.originalServings = getServingsAmount(this.recipe);
      this.scaleFactor = 1;
      this.scaleFactorInput = "1";
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has("recipe") && this.recipe) {
      this.originalServings = getServingsAmount(this.recipe);
      this.scaleFactor = 1;
      this.scaleFactorInput = "1";
      // If recipe doesn't have scaling stack and we're on scale view, switch to cook
      if (this.view === "scale" && !hasStack(this.recipe, "scaling")) {
        this.view = "cook";
      }
    }
  }

  private get currentServings(): number {
    return this.originalServings * this.scaleFactor;
  }

  private toggleExpand(event: Event): void {
    // Prevent toggling if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "INPUT" ||
      target.closest("button") ||
      target.closest("input") ||
      target.closest("a")
    ) {
      return;
    }
    this.expanded = !this.expanded;
  }

  private setView(view: "cook" | "mise" | "scale"): void {
    this.view = view;
  }

  private adjustScaleFactor(delta: number): void {
    const newScaleFactor = this.scaleFactor + delta;
    if (newScaleFactor > 0) {
      this.scaleFactor = newScaleFactor;
      this.scaleFactorInput = this.scaleFactor.toFixed(2);
    }
  }

  private setScaleFactor(factor: number): void {
    if (factor > 0) {
      this.scaleFactor = factor;
      this.scaleFactorInput = factor.toFixed(2);
    }
  }

  private handleScaleFactorInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    this.scaleFactorInput = value;
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      this.scaleFactor = numValue;
    }
  }

  private handleScaleFactorBlur(): void {
    // Validate and normalize on blur
    const numValue = parseFloat(this.scaleFactorInput);
    if (isNaN(numValue) || numValue <= 0) {
      // Reset to current scale factor if invalid
      this.scaleFactorInput = this.scaleFactor.toFixed(2);
    } else {
      this.scaleFactor = numValue;
      this.scaleFactorInput = this.scaleFactor.toFixed(2);
    }
  }

  private renderViewToggle(): TemplateResult {
    const currentServings = Math.floor(this.currentServings);
    const servingText = currentServings === 1 ? "serving" : "servings";
    const hasScalingStack = hasStack(this.recipe, "scaling");
    
    return html`
      <div class="view-toggle">
        <button
          class="view-toggle-button ${this.view === "cook" ? "active" : ""}"
          @click=${() => this.setView("cook")}
        >
          Cook
        </button>
        <button
          class="view-toggle-button ${this.view === "mise" ? "active" : ""}"
          @click=${() => this.setView("mise")}
        >
          Mise en place
        </button>
        ${hasScalingStack
          ? html`
              <button
                class="view-toggle-button ${this.view === "scale" ? "active" : ""}"
                @click=${() => this.setView("scale")}
              >
                Scale
              </button>
            `
          : null}
      </div>
      <div class="servings-display">
        Makes ${currentServings} ${servingText}
      </div>
    `;
  }

  private renderScalingControls(): TemplateResult {
    const canDecrease = this.scaleFactor > 0.25;

    return html`
      <div class="scaling-controls">
        <span class="scaling-label">Scale:</span>
        <button
          class="scaling-button"
          @click=${() => this.adjustScaleFactor(-0.25)}
          ?disabled=${!canDecrease}
          aria-label="Decrease scale"
        >
          −
        </button>
        <input
          type="text"
          class="scaling-input"
          .value=${this.scaleFactorInput}
          @input=${this.handleScaleFactorInput}
          @blur=${this.handleScaleFactorBlur}
          aria-label="Scale factor"
        />
        <span class="scaling-multiplier">×</span>
        <button
          class="scaling-button"
          @click=${() => this.adjustScaleFactor(0.25)}
          aria-label="Increase scale"
        >
          +
        </button>
        <div class="scaling-quick-buttons">
          <button
            class="scaling-quick-button"
            @click=${() => this.setScaleFactor(0.5)}
          >
            Half
          </button>
          <button
            class="scaling-quick-button"
            @click=${() => this.setScaleFactor(1)}
          >
            Reset
          </button>
          <button
            class="scaling-quick-button"
            @click=${() => this.setScaleFactor(2)}
          >
            Double
          </button>
        </div>
      </div>
    `;
  }

  private renderIngredients(ingredients: IngredientEntry[]): TemplateResult {
    if (!ingredients || ingredients.length === 0) {
      return html`<div class="ingredients-section">
        <h3 class="section-title">Ingredients</h3>
        <p class="empty">No ingredients provided.</p>
      </div>`;
    }

    const renderIngredientItem = (entry: IngredientEntry): TemplateResult => {
      const scaled = scaleIngredient(entry, this.scaleFactor);
      // Only show warnings when recipe is being scaled (scaleFactor !== 1)
      const showWarning = scaled.warning && this.scaleFactor !== 1;
      return html`
        <li
          class="ingredient-item ${showWarning ? "has-warning" : ""}"
        >
          ${scaled.display}
          ${showWarning
            ? html`<span class="ingredient-warning">${scaled.warning}</span>`
            : null}
        </li>
      `;
    };

    const renderIngredientEntry = (entry: IngredientEntry): TemplateResult => {
      if (isIngredientSubsection(entry)) {
        return html`
          <div class="subsection">
            <label class="subsection-label">${entry.subsection}</label>
            <ul class="ingredient-list">
              ${entry.items.map((item) => renderIngredientItem(item))}
            </ul>
          </div>
        `;
      }

      return renderIngredientItem(entry);
    };

    // Check if we have any subsections
    const hasSubsections = ingredients.some((entry) =>
      isIngredientSubsection(entry)
    );

    if (hasSubsections) {
      // Render subsections and individual items separately
      return html`
        <div class="ingredients-section">
          <h3 class="section-title">Ingredients</h3>
          ${ingredients.map((entry) => renderIngredientEntry(entry))}
        </div>
      `;
    } else {
      // All items are individual, render in a single list
      return html`
        <div class="ingredients-section">
          <h3 class="section-title">Ingredients</h3>
          <ul class="ingredient-list">
            ${ingredients.map((entry) => renderIngredientItem(entry))}
          </ul>
        </div>
      `;
    }
  }

  private renderInstructions(instructions: InstructionEntry[]): TemplateResult {
    if (!instructions || instructions.length === 0) {
      return html`<div class="instructions-section">
        <h3 class="section-title">Instructions</h3>
        <p class="empty">No instructions provided.</p>
      </div>`;
    }

    const renderInstructionItem = (
      entry: InstructionEntry
    ): TemplateResult => {
      const text = extractInstructionText(entry);
      const scaleAdjustment =
        typeof entry === "object" &&
        entry !== null &&
        "scaleAdjustment" in entry
          ? (entry as { scaleAdjustment?: { trigger?: number; note?: string } })
              .scaleAdjustment
          : undefined;

      const showAdjustment =
        scaleAdjustment &&
        scaleAdjustment.trigger !== undefined &&
        Math.abs(this.scaleFactor - scaleAdjustment.trigger) < 0.01;

      return html`
        <li class="instruction-item">
          ${text}
          ${showAdjustment && scaleAdjustment?.note
            ? html`<span class="instruction-scale-note"
                >${scaleAdjustment.note}</span
              >`
            : null}
        </li>
      `;
    };

    const renderInstructionEntry = (
      entry: InstructionEntry
    ): TemplateResult => {
      if (isInstructionSubsection(entry)) {
        return html`
          <div class="subsection">
            <label class="subsection-label">${entry.subsection}</label>
            <ol class="instruction-list">
              ${entry.items.map((item) => renderInstructionItem(item))}
            </ol>
          </div>
        `;
      }

      return renderInstructionItem(entry);
    };

    // Check if we have any subsections
    const hasSubsections = instructions.some((entry) =>
      isInstructionSubsection(entry)
    );

    if (hasSubsections) {
      // Render subsections and individual items separately
      return html`
        <div class="instructions-section">
          <h3 class="section-title">Instructions</h3>
          ${instructions.map((entry) => renderInstructionEntry(entry))}
        </div>
      `;
    } else {
      // All items are individual, render in a single list
      return html`
        <div class="instructions-section">
          <h3 class="section-title">Instructions</h3>
          <ol class="instruction-list">
            ${instructions.map((entry) => renderInstructionItem(entry))}
          </ol>
        </div>
      `;
    }
  }

  private renderMiseEnPlace(recipe: RecipeLike): TemplateResult {
    const equipment = recipe.equipment || [];
    const ingredients = recipe.ingredients || [];

    // Flatten ingredients and group by prepAction
    const flattened = flattenIngredientEntries(ingredients);
    const prepTasksByAction = new Map<string, typeof flattened>();

    for (const ing of flattened) {
      const prepAction = ing.prepAction || "General Prep";
      if (!prepTasksByAction.has(prepAction)) {
        prepTasksByAction.set(prepAction, []);
      }
      prepTasksByAction.get(prepAction)!.push(ing);
    }

    const renderPrepTask = (ing: typeof flattened[0]): TemplateResult => {
      const scaled = scaleIngredient(ing as IngredientEntry, this.scaleFactor);
      const metaParts: string[] = [];
      if (ing.prep || ing.meta?.prep) {
        metaParts.push(ing.prep || ing.meta?.prep || "");
      }
      if (ing.destination || ing.meta?.destination) {
        metaParts.push(ing.destination || ing.meta?.destination || "");
      }
      const metaLine = metaParts.length > 0 ? metaParts.join(", ") : undefined;

      return html`
        <li class="prep-task-item">
          <input
            type="checkbox"
            class="prep-task-checkbox"
            id="prep-${Math.random().toString(36).substr(2, 9)}"
          />
          <div class="prep-task-content">
            ${scaled.display}
            ${metaLine
              ? html`<span class="prep-task-meta">${metaLine}</span>`
              : null}
          </div>
        </li>
      `;
    };

    return html`
      <div class="mise-section">
        ${equipment.length > 0
          ? html`
              <div class="mise-section">
                <h3 class="section-title">Equipment</h3>
                <ul class="equipment-list">
                  ${equipment.map(
                    (item) => html`
                      <li class="equipment-item">
                        <input
                          type="checkbox"
                          class="equipment-checkbox"
                          id="equip-${Math.random().toString(36).substr(2, 9)}"
                        />
                        <label for="equip-${Math.random().toString(36).substr(2, 9)}"
                          >${item}</label
                        >
                      </li>
                    `
                  )}
                </ul>
              </div>
            `
          : null}
        ${prepTasksByAction.size > 0
          ? html`
              <div class="mise-section">
                <h3 class="section-title">Prep Tasks</h3>
                ${Array.from(prepTasksByAction.entries()).map(
                  ([prepAction, tasks]) => html`
                    <div class="prep-tasks-group">
                      <div class="prep-tasks-title">${prepAction}</div>
                      <ul class="prep-task-list">
                        ${tasks.map((task) => renderPrepTask(task))}
                      </ul>
                    </div>
                  `
                )}
              </div>
            `
          : null}
      </div>
    `;
  }

  render(): TemplateResult {
    const recipe = this.recipe as RecipeLike | undefined;
    if (!recipe) {
      return html`<div class="recipe-card">No recipe provided.</div>`;
    }

    const name = getRecipeName(recipe) || "Recipe";
    const ingredients = recipe.ingredients || [];
    const instructions = recipe.instructions || [];
    const scaleWarnings =
      this.scaleFactor !== 1 && recipe.scaleWarnings
        ? recipe.scaleWarnings
        : undefined;

    return html`
      <div class="recipe-card ${this.expanded ? "expanded" : ""}" @click=${this.toggleExpand}>
        <header class="recipe-header">
          <h2 class="recipe-title">${name}</h2>
        </header>
        ${recipe.time?.total && !this.expanded
          ? html`
              <div class="recipe-card-collapsed-info">
                <span>Total time: ${recipe.time.total}</span>
              </div>
            `
          : null}
        <div class="recipe-content ${this.expanded ? "expanded" : ""}">
          ${this.renderViewToggle()}
          ${this.view === "scale"
            ? this.renderScalingControls()
            : null}
          ${this.view === "cook" || this.view === "scale"
            ? html`
                ${scaleWarnings
                  ? html`
                      <div class="scale-warnings">
                        <div class="scale-warnings-title">Scale Warnings</div>
                        <ul class="scale-warnings-list">
                          ${scaleWarnings.map(
                            (warning) => html`<li>${warning}</li>`
                          )}
                        </ul>
                      </div>
                    `
                  : null}
                <div class="recipe-sections-container">
                  ${this.renderIngredients(ingredients)}
                  ${this.renderInstructions(instructions)}
                </div>
                ${recipe.time
                  ? html`
                      <div class="time-summary">
                        ${recipe.time.prep
                          ? html`
                              <div class="time-summary-item">
                                Prep: ${recipe.time.prep}
                              </div>
                            `
                          : null}
                        ${recipe.time.cook
                          ? html`
                              <div class="time-summary-item">
                                Cook: ${recipe.time.cook}
                              </div>
                            `
                          : null}
                        ${recipe.time.total
                          ? html`
                              <div class="time-summary-item">
                                Total: ${recipe.time.total}
                              </div>
                            `
                          : null}
                      </div>
                    `
                  : null}
              `
            : this.view === "mise"
            ? this.renderMiseEnPlace(recipe)
            : null}
        </div>
      </div>
    `;
  }
}

// Register the custom element
const elementName = "soustack-recipe-card";

try {
  customElements.define(elementName, SoustackRecipeCard);
} catch (error) {
  // Element already defined (can happen with HMR or multiple module loads)
}

declare global {
  interface HTMLElementTagNameMap {
    "soustack-recipe-card": SoustackRecipeCard;
  }
}

