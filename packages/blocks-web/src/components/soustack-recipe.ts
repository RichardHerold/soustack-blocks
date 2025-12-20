import { css, html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

const normalizeList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => stringifyItem(item)).filter(Boolean);
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidate = Array.isArray(record.items)
      ? record.items
      : Object.values(record);

    if (Array.isArray(candidate)) {
      return candidate.map((item) => stringifyItem(item)).filter(Boolean);
    }
  }

  return [];
};

const stringifyItem = (item: unknown): string => {
  if (typeof item === "string") {
    return item;
  }

  if (typeof item === "number" || typeof item === "boolean") {
    return String(item);
  }

  if (item && typeof item === "object") {
    const record = item as Record<string, unknown>;
    const label =
      typeof record.name === "string"
        ? record.name
        : typeof record.title === "string"
          ? record.title
          : undefined;
    const amount =
      typeof record.amount === "string" || typeof record.amount === "number"
        ? String(record.amount)
        : typeof record.quantity === "string" ||
            typeof record.quantity === "number"
          ? String(record.quantity)
          : undefined;
    const description =
      typeof record.description === "string"
        ? record.description
        : typeof record.step === "string"
          ? record.step
          : undefined;

    const composed = [label, amount ? `(${amount})` : undefined, description]
      .filter(Boolean)
      .join(" ");

    if (composed) {
      return composed;
    }

    const entries = Object.entries(record)
      .map(([key, value]) => {
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          return `${key}: ${value}`;
        }

        return undefined;
      })
      .filter((entry): entry is string => Boolean(entry));

    if (entries.length > 0) {
      return entries.join(", ");
    }
  }

  return "";
};

const renderSection = (
  title: string,
  value: unknown,
  emptyMessage = "Not provided."
): TemplateResult => {
  if (typeof value === "string" && value.trim().length > 0) {
    return html`<section>
      <h3>${title}</h3>
      <p>${value}</p>
    </section>`;
  }

  const listItems = normalizeList(value);
  if (listItems.length > 0) {
    return html`<section>
      <h3>${title}</h3>
      <ul>
        ${listItems.map((item) => html`<li>${item}</li>`)}
      </ul>
    </section>`;
  }

  return html`<section>
    <h3>${title}</h3>
    <p class="empty">${emptyMessage}</p>
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

    .empty {
      color: #6b7280;
      font-style: italic;
    }
  `;

  @property({ attribute: false })
  recipe: unknown;

  render(): TemplateResult {
    const recipe = this.recipe;
    const record = recipe && typeof recipe === "object" ? (recipe as Record<string, unknown>) : undefined;
    const name =
      record && typeof record.name === "string" && record.name.trim().length > 0
        ? record.name
        : "Recipe";
    const ingredients = record?.ingredients;
    const instructions = record?.instructions;
    const stacks = record?.stacks ?? record?.declaredStacks ?? record?.stack;

    return html`
      <article>
        <h2>${name}</h2>
        ${renderSection("Ingredients", ingredients)}
        ${renderSection("Instructions", instructions)}
        ${renderSection("Stacks", stacks, "No stacks declared.")}
      </article>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "soustack-recipe": SoustackRecipe;
  }
}
