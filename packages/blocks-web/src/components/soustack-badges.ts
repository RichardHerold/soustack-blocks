import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import {
  getDeclaredStacksList,
  getProfile,
  getStacks,
  inferProfileFromStacks,
  KNOWN_STACK_ORDER,
  PROFILES,
} from "@soustack/blocks-core";

type BadgeMode = "user" | "dev";

const stripMajor = (tag: string): string => {
  const atIndex = tag.lastIndexOf("@");
  if (atIndex === -1) {
    return tag;
  }

  return tag.slice(0, atIndex);
};

const compareStackNames = (a: string, b: string): number => {
  const indexA = KNOWN_STACK_ORDER.indexOf(a);
  const indexB = KNOWN_STACK_ORDER.indexOf(b);
  const normalizedA = indexA === -1 ? Number.POSITIVE_INFINITY : indexA;
  const normalizedB = indexB === -1 ? Number.POSITIVE_INFINITY : indexB;

  if (normalizedA !== normalizedB) {
    return normalizedA - normalizedB;
  }

  return a.localeCompare(b);
};

export class SoustackBadges extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .badges {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .badge {
      border: 1px solid #d1d5db;
      border-radius: 999px;
      padding: 2px 8px;
      font-size: 12px;
      line-height: 1.4;
      color: #111827;
    }

    .badge.profile {
      border-width: 2px;
      font-weight: 600;
    }

    .badge.missing {
      border-style: dashed;
      color: #6b7280;
    }
  `;

  @property({ attribute: false })
  recipe: unknown;

  @property({ type: String, reflect: true })
  mode: BadgeMode = "user";

  render(): TemplateResult {
    const stacks = getStacks(this.recipe);
    const declaredStacks = getDeclaredStacksList(this.recipe);
    const normalizedMode: BadgeMode = this.mode === "dev" ? "dev" : "user";

    const explicitProfile = getProfile(this.recipe);
    const isExplicitKnown = Boolean(explicitProfile && PROFILES[explicitProfile]);
    const profileResult = isExplicitKnown
      ? { profile: explicitProfile, inferred: false }
      : inferProfileFromStacks(stacks);
    const profileKey =
      profileResult.profile && PROFILES[profileResult.profile]
        ? profileResult.profile
        : undefined;

    const badges: TemplateResult[] = [];
    if (profileKey) {
      const profileLabel = profileResult.inferred
        ? `${PROFILES[profileKey].label} (inferred)`
        : PROFILES[profileKey].label;
      badges.push(html`<span class="badge profile">${profileLabel}</span>`);
    }

    const activeStacks =
      normalizedMode === "dev"
        ? declaredStacks
        : declaredStacks.map((stack) => stripMajor(stack));

    const activeBadges = activeStacks.map(
      (label) => html`<span class="badge">${label}</span>`
    );
    badges.push(...activeBadges);

    if (normalizedMode === "dev" && profileKey) {
      const requiredStacks = PROFILES[profileKey]?.requiresStacks ?? [];
      const missingStacks = requiredStacks
        .filter((name) => !stacks[name])
        .sort(compareStackNames)
        .map(
          (name) => html`<span class="badge missing">${name}@1</span>`
        );
      badges.push(...missingStacks);
    }

    return html`<div class="badges">${badges}</div>`;
  }
}

// Register the custom element with error handling for HMR/reload scenarios
const badgesElementName = "soustack-badges";
try {
  customElements.define(badgesElementName, SoustackBadges);
} catch (error) {
  // Element already defined (can happen with HMR or multiple module loads)
  // This is expected and safe to ignore
}

declare global {
  interface HTMLElementTagNameMap {
    "soustack-badges": SoustackBadges;
  }
}
