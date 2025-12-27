# Demo App

This demo application provides manual QA and fast design iteration for the `blocks-web` package components.

## Quick Start

From the repository root:

```sh
npm install
npm run dev
```

The demo will be available at [http://localhost:5173](http://localhost:5173).

## Demo Sections

### Embed Showcase

Tests the embed functionality with real JSON files:

- **Explicit URL**: Uses `data-soustack` attribute to fetch a recipe JSON file
- **Discovery**: Uses `data-soustack-discover` to automatically find recipe URLs
- **Themed Example**: Demonstrates CSS variable overrides for theming

This section is ideal for end-to-end embed testing and verifying the embed package works correctly.

### Design Sandbox

Fast-iteration design testing with in-memory fixtures (no network requests):

- **Layout Frames**: Shows the recipe card in different container widths (narrow, wide, default)
- **Themed Variants**: Demonstrates CSS variable theming
- **All Fixtures**: Displays all recipe fixture types side-by-side

This section is ideal for rapid design iteration with instant HMR feedback.

## Editing Design

### Component Styles

Edit the recipe card component:

- `packages/blocks-web/src/components/soustack-recipe.ts` - Component markup and styles

### Design Tokens

Edit design tokens:

- `packages/blocks-web/src/styles/tokens.ts` - CSS variables for colors, spacing, typography

Changes will hot-reload automatically via Vite HMR.

## Adding Fixtures

Fixtures live in `apps/demo/src/design-sandbox.ts`. To add a new recipe fixture:

1. Create a new recipe object following the `RecipeLike` structure:

```typescript
const myRecipe = {
  name: "My Recipe",
  ingredients: ["Item 1", "Item 2"],
  instructions: ["Step 1", "Step 2"],
  stacks: { quantified: { version: { major: 1 } } }
};
```

2. Add it to the `fixtures` array:

```typescript
const fixtures = [simpleRecipe, longRecipe, multiSectionRecipe, minimalRecipe, myRecipe];
```

3. Optionally render it in the showcase by adding a new grid item in the `renderDesignSandbox` function.

## Theming

Override CSS variables on any container to theme the recipe cards:

```html
<div style="--soustack-accent: #8b5cf6; --soustack-card-bg: #f3f4f6; --soustack-border: #cbd5e1;">
  <soustack-recipe></soustack-recipe>
</div>
```

Available tokens (see `packages/blocks-web/src/styles/tokens.ts`):

- `--soustack-accent` - Accent color
- `--soustack-border` - Border color
- `--soustack-card-bg` - Card background
- `--soustack-text` - Primary text color
- `--soustack-text-muted` - Muted text color
- `--soustack-shadow` - Box shadow
- `--soustack-radius` - Border radius
- `--soustack-space-1`, `--soustack-space-2`, `--soustack-space-3` - Spacing scale
- `--soustack-font-sans` - Font family
- `--soustack-font-size-base` - Base font size
- `--soustack-line-height` - Line height

