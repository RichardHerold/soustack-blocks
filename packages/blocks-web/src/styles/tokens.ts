import { css } from "lit";

/**
 * Design tokens for Soustack components.
 * These tokens are defined on :host to allow theme overrides via CSS variables.
 */
export const soustackTokens = css`
  :host {
    /* Colors */
    --soustack-accent: #3b82f6;
    --soustack-border: #e5e7eb;
    --soustack-card-bg: #ffffff;
    --soustack-text: #1f2933;
    --soustack-text-muted: #6b7280;

    /* Shadows */
    --soustack-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);

    /* Border radius */
    --soustack-radius: 12px;

    /* Spacing scale */
    --soustack-space-1: 0.5rem;
    --soustack-space-2: 1rem;
    --soustack-space-3: 1.5rem;

    /* Typography */
    --soustack-font-sans: system-ui, -apple-system, "Segoe UI", "Inter", sans-serif;
    --soustack-font-size-base: 1rem;
    --soustack-line-height: 1.5;
  }
`;

