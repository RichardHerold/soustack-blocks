# Repo Pack: soustack-blocks
Generated: 2025-12-19T22:14:02-05:00
Git: branch=main sha=a37cae7a7eed5f760692dd8d7a14f73eaad0a9b8 dirty=true
Limits: maxFileKB=512, maxTotalMB=5

## File Tree (paths)
```text
.gitignore
apps/demo/index.html
apps/demo/package.json
apps/demo/src/demo-data.ts
apps/demo/src/main.ts
apps/demo/tsconfig.json
apps/demo/vite.config.ts
LICENSE
package.json
packages/blocks-core/package.json
packages/blocks-core/src/index.ts
packages/blocks-core/src/recipe.ts
packages/blocks-core/src/stacks.ts
packages/blocks-core/tsconfig.json
packages/blocks-web/package.json
packages/blocks-web/src/components/soustack-recipe.ts
packages/blocks-web/src/index.ts
packages/blocks-web/src/styles.d.ts
packages/blocks-web/src/styles/base.css
packages/blocks-web/tsconfig.json
packages/blocks-web/vite.config.ts
README.md
scripts/dump-repo-for-ai.mjs
tsconfig.base.json
```

Files (contents)

FILE: .gitignore
	• bytes: 57
	• sha256: 36bc2ff9f7d1179e263d9f74efde1cd1131c401796fd2c5c95752f00d03a3970

node_modules/
dist/
build/
.turbo/
.env
.env.*
.DS_Store

FILE: apps/demo/index.html
	• bytes: 305
	• sha256: e1f9b20c9eeeeb041279bd419c2125ee2cb1ccb143ee52d093f57f57f7872943

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Soustack Blocks Demo</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>

FILE: apps/demo/package.json
	• bytes: 300
	• sha256: 68b621800f236bfe63434170222b854475c932b3121e054866bdd313f8cd7429

{
  "name": "@soustack/demo",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@soustack/blocks-web": "*"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "vite": "^5.2.0"
  }
}

FILE: apps/demo/src/demo-data.ts
	• bytes: 347
	• sha256: 8bbc2c45f9742a43f6e264abf6c92257ad490be3d2d7c3bb5d900b16538d136e

export const recipeFixture = {
  name: "Soustack Seed Recipe",
  stacks: {
    "stack:typescript": 1,
    "stack:lit": 1
  },
  ingredients: [
    { name: "TypeScript", amount: "1" },
    { name: "Lit", amount: "1" }
  ],
  instructions: [
    "Register the Soustack blocks web components.",
    "Render the recipe with a minimal fixture."
  ]
};

FILE: apps/demo/src/main.ts
	• bytes: 351
	• sha256: a58103e9554881256bafbb2a146d70d98d0a3803e9363d938e210cbaf89e448b

import "@soustack/blocks-web";
import { recipeFixture } from "./demo-data";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = "";
  const recipe = document.createElement("soustack-recipe");
  recipe.recipe = recipeFixture;
  app.appendChild(recipe);
} else {
  throw new Error("Missing #app root element.");
}

FILE: apps/demo/tsconfig.json
	• bytes: 123
	• sha256: 55f70ed2825f44f6a9b4000913414ac02375f0fab9dc4bd1e94ce202151b8416

{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "types": ["vite/client"]
  },
  "include": ["src"]
}

FILE: apps/demo/vite.config.ts
	• bytes: 103
	• sha256: bd84bfae62165d49f75fe8b262472663b5843e8741f5ac14031ab96ff4b0c681

import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173
  }
});

FILE: LICENSE
	• bytes: 1065
	• sha256: 874cb5bf0dc8687d0d5f1a64357724dc8ad908c7c5b667316367dbfbd74fc306

MIT License

Copyright (c) 2024 Soustack

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

FILE: package.json
	• bytes: 163
	• sha256: f41bfeb90f19f29406d935aebc6af4ba668ad0d679b641bb3ea4c0b4c4052535

{
  "name": "soustack-blocks",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "npm run dev -w apps/demo"
  }
}

FILE: packages/blocks-core/package.json
	• bytes: 388
	• sha256: 022b5431de21cebfde9b9d67ab823ae2e9da207afcaaad99d6bae021885fdd9c

{
  "name": "@soustack/blocks-core",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsc -p tsconfig.json"
  }
}

FILE: packages/blocks-core/src/index.ts
	• bytes: 176
	• sha256: e85445d1eb474b6d7dde690d15a494056beded80fa9e1d93556b5076aa58f77d

export { normalizeStacks } from "./stacks";
export {
  getDeclaredStacksList,
  getIngredients,
  getInstructions,
  getRecipeName,
  getStacks,
  hasStack,
} from "./recipe";

FILE: packages/blocks-core/src/recipe.ts
	• bytes: 2036
	• sha256: 4a90e978e728ae83520e3aff68cabd4e7e183e062f38328c973ef915d3301814

import { normalizeStacks, type StackInput } from "./stacks";

type RecipeLike = {
  name?: string;
  title?: string;
  stacks?: StackInput;
  declaredStacks?: StackInput | string[];
  declaredStacksList?: StackInput | string[];
  ingredients?: unknown;
  instructions?: unknown;
};

const isRecipeRecord = (value: unknown): value is RecipeLike =>
  typeof value === "object" && value !== null;

const toStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }

  if (typeof value === "string") {
    return [value];
  }

  return [];
};

export const getStacks = (recipe: unknown): Record<string, number> => {
  if (!isRecipeRecord(recipe)) {
    return {};
  }

  const stacksSource =
    recipe.stacks ?? recipe.declaredStacks ?? recipe.declaredStacksList;

  return normalizeStacks(stacksSource as StackInput);
};

export const hasStack = (recipe: unknown, stackId: string): boolean => {
  if (!stackId) {
    return false;
  }

  const stacks = getStacks(recipe);
  return (stacks[stackId] ?? 0) > 0;
};

export const getRecipeName = (recipe: unknown): string => {
  if (!isRecipeRecord(recipe)) {
    return "";
  }

  return recipe.name ?? recipe.title ?? "";
};

export const getIngredients = (recipe: unknown): unknown => {
  if (!isRecipeRecord(recipe)) {
    return [];
  }

  return recipe.ingredients ?? [];
};

export const getInstructions = (recipe: unknown): unknown => {
  if (!isRecipeRecord(recipe)) {
    return [];
  }

  return recipe.instructions ?? [];
};

export const getDeclaredStacksList = (recipe: unknown): string[] => {
  if (!isRecipeRecord(recipe)) {
    return [];
  }

  const declared =
    recipe.declaredStacksList ?? recipe.declaredStacks ?? recipe.stacks;

  if (Array.isArray(declared)) {
    return toStringList(declared);
  }

  if (typeof declared === "string") {
    return [declared];
  }

  const normalized = normalizeStacks(declared as StackInput);
  return Object.keys(normalized);
};

FILE: packages/blocks-core/src/stacks.ts
	• bytes: 1677
	• sha256: 6ee10a01531a54ff9245f2ab71bf5e313e07a11efa993e847be82e1d28c7850f

export type StackInput =
  | Record<string, number>
  | Array<string | { id?: string; stackId?: string; amount?: number; quantity?: number }>
  | null
  | undefined;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
};

const toStackId = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return null;
};

export const normalizeStacks = (input: StackInput): Record<string, number> => {
  if (!input) {
    return {};
  }

  if (Array.isArray(input)) {
    return input.reduce<Record<string, number>>((acc, entry) => {
      if (typeof entry === "string") {
        acc[entry] = (acc[entry] ?? 0) + 1;
        return acc;
      }

      if (isRecord(entry)) {
        const id = toStackId(entry.stackId ?? entry.id);
        if (!id) {
          return acc;
        }

        const amount =
          toNumber(entry.amount) ||
          toNumber(entry.quantity) ||
          1;

        acc[id] = (acc[id] ?? 0) + amount;
      }

      return acc;
    }, {});
  }

  if (isRecord(input)) {
    return Object.entries(input).reduce<Record<string, number>>((acc, [key, value]) => {
      const amount = toNumber(value);
      if (amount !== 0) {
        acc[key] = amount;
      }
      return acc;
    }, {});
  }

  return {};
};

FILE: packages/blocks-core/tsconfig.json
	• bytes: 223
	• sha256: d6b778fca0f559500db8c4febb111b4c57fa1f55347c8ca0ae0e88be52fb5761

{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "noEmit": false
  },
  "include": ["src/**/*.ts"]
}

FILE: packages/blocks-web/package.json
	• bytes: 608
	• sha256: 1afd5e2e30e3607fef6994d8d8b8a964125e0a8441cb5f27b1aa22b3f62d359e

{
  "name": "@soustack/blocks-web",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./styles/base.css": "./dist/styles/base.css"
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "vite build && tsc -p tsconfig.json"
  },
  "dependencies": {
    "@soustack/blocks-core": "*",
    "lit": "^3.1.2"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "vite": "^5.2.0"
  }
}

FILE: packages/blocks-web/src/components/soustack-recipe.ts
	• bytes: 4191
	• sha256: c9a0603baf83e04c30bf3586dc97f1da932b6bd135e525c6943991aa864410a1

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

FILE: packages/blocks-web/src/index.ts
	• bytes: 92
	• sha256: 6c3d71dd915a187b638b5ad450ee6e63a35ed7e05edb96baf8ef452f756a1d55

import "./styles/base.css";

export { SoustackRecipe } from "./components/soustack-recipe";

FILE: packages/blocks-web/src/styles.d.ts
	• bytes: 78
	• sha256: ed40c186ec554494b80630ad8870fce60d5eeea16c30c00e6dd59846d78b8701

declare module "*.css" {
  const content: string;
  export default content;
}

FILE: packages/blocks-web/src/styles/base.css
	• bytes: 308
	• sha256: 18fc20f031367f3c92c6fb82b219850fba36157daf3b3a2e41a4ae617e56b081

:root {
  color: #1f2933;
  background-color: #ffffff;
  font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  line-height: 1.5;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

h2,
h3 {
  margin: 0 0 0.5rem;
  font-weight: 600;
}

ul {
  padding-left: 1.25rem;
}

FILE: packages/blocks-web/tsconfig.json
	• bytes: 273
	• sha256: 885ad2e312518d452d08c48ac7ba35f50bb6147de6d62b681d0c94c17326b03f

{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "noEmit": false
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts"]
}

FILE: packages/blocks-web/vite.config.ts
	• bytes: 366
	• sha256: aeb62cc95a0b64aadc6e37f26ef7077264baa709e54ad081f2fd6234f32b9623

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "SoustackBlocksWeb",
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["lit", "@soustack/blocks-core"],
      output: {
        assetFileNames: "styles/[name][extname]"
      }
    }
  }
});

FILE: README.md
	• bytes: 279
	• sha256: 9a79a8d2376c5f4a53d2412ad17358aff87ff319e9245435a3e43df58dc08e71

# Soustack Blocks Monorepo

This repository is organized as a TypeScript monorepo with npm workspaces.

## Structure

- `apps/` for runnable applications
- `packages/` for shared libraries and packages

## Development

Run the demo app from the repo root:

```sh
npm run dev
```

FILE: scripts/dump-repo-for-ai.mjs
	• bytes: 10393
	• sha256: ee4d03bb723904dfcbf6fd353e7ac33bf51c8b04f5b67c83a113e32b960dcd0d

#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';

const DEFAULT_MAX_FILE_KB = 512;
const DEFAULT_MAX_TOTAL_MB = 5;
const DEFAULT_OUT = 'repo-pack.md';

const argv = process.argv.slice(2);
const options = {
  out: DEFAULT_OUT,
  maxFileKB: DEFAULT_MAX_FILE_KB,
  maxTotalMB: DEFAULT_MAX_TOTAL_MB,
};

for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i];
  if (arg === '--out') {
    options.out = argv[i + 1];
    i += 1;
  } else if (arg === '--maxFileKB') {
    options.maxFileKB = Number(argv[i + 1]);
    i += 1;
  } else if (arg === '--maxTotalMB') {
    options.maxTotalMB = Number(argv[i + 1]);
    i += 1;
  }
}

const repoRoot = process.cwd();
const repoName = path.basename(repoRoot);
const maxFileBytes = Math.max(0, Math.floor(options.maxFileKB * 1024));
const maxTotalBytes = Math.max(0, Math.floor(options.maxTotalMB * 1024 * 1024));

const OUTPUT_PATH = normalizePath(path.relative(repoRoot, path.resolve(repoRoot, options.out)));

const DEFAULT_IGNORED_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  '.next',
  'out',
  'coverage',
  '.turbo',
  '.cache',
  '.parcel-cache',
]);

const DEFAULT_IGNORED_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb',
  'Cargo.lock',
]);

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.ico',
  '.mp4', '.mp3', '.mov', '.avi', '.mkv', '.wav', '.flac', '.ogg',
  '.zip', '.tar', '.gz', '.tgz', '.rar', '.7z', '.bz2', '.xz',
  '.pdf', '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.exe', '.dll', '.so', '.dylib', '.bin', '.dat',
]);

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/');
}

function readIgnoreFile(filePath) {
  return fs.readFile(filePath, 'utf8')
    .then((contents) => contents.split(/\r?\n/))
    .catch(() => []);
}

function globToRegExp(pattern) {
  let source = '';
  let i = 0;
  while (i < pattern.length) {
    const char = pattern[i];
    if (char === '*') {
      const next = pattern[i + 1];
      if (next === '*') {
        source += '.*';
        i += 2;
      } else {
        source += '[^/]*';
        i += 1;
      }
    } else if (char === '?') {
      source += '[^/]';
      i += 1;
    } else {
      source += char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      i += 1;
    }
  }
  return new RegExp(`^${source}$`);
}

function buildIgnoreMatchers(lines) {
  const matchers = [];
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const isNegated = trimmed.startsWith('!');
    const pattern = isNegated ? trimmed.slice(1) : trimmed;
    const isDir = pattern.endsWith('/');
    const normalized = normalizePath(pattern.replace(/\/$/, ''));
    const anchored = normalized.startsWith('/');
    const body = anchored ? normalized.slice(1) : normalized;
    const regex = globToRegExp(body);
    matchers.push({
      isNegated,
      isDir,
      anchored,
      regex,
    });
  }
  return matchers;
}

function matchesIgnore(matchers, targetPath, isDir) {
  let ignored = false;
  for (const matcher of matchers) {
    if (matcher.isDir && !isDir) {
      continue;
    }
    if (matcher.anchored) {
      if (matcher.regex.test(targetPath)) {
        ignored = !matcher.isNegated;
      }
      continue;
    }
    if (matchesAnySegment(matcher.regex, targetPath)) {
      ignored = !matcher.isNegated;
    }
  }
  return ignored;
}

function matchesAnySegment(regex, targetPath) {
  const segments = targetPath.split('/');
  for (let i = 0; i < segments.length; i += 1) {
    const candidate = segments.slice(i).join('/');
    if (candidate && regex.test(candidate)) {
      return true;
    }
  }
  return false;
}

function isBinaryExtension(filePath) {
  return BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function isLikelyText(buffer) {
  if (buffer.includes(0)) {
    return false;
  }
  try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    decoder.decode(buffer);
    return true;
  } catch {
    return false;
  }
}

async function collectIgnoreMatchers() {
  const gitIgnoreLines = await readIgnoreFile(path.join(repoRoot, '.gitignore'));
  const repoPackIgnoreLines = await readIgnoreFile(path.join(repoRoot, '.repo-pack-ignore'));
  const matchers = buildIgnoreMatchers([...gitIgnoreLines, ...repoPackIgnoreLines]);
  return matchers;
}

async function walkRepo(matchers) {
  const included = [];
  const skipped = [];
  let totalBytes = 0;

  async function walk(currentDir) {
    let entries;
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true });
    } catch (error) {
      skipped.push({
        path: normalizePath(path.relative(repoRoot, currentDir)) || '.',
        reason: `read error: ${error.message}`,
      });
      return;
    }

    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = normalizePath(path.relative(repoRoot, fullPath));
      if (!relativePath) {
        continue;
      }

      if (entry.isDirectory()) {
        if (DEFAULT_IGNORED_DIRS.has(entry.name)) {
          skipped.push({ path: relativePath + '/', reason: 'ignored directory' });
          continue;
        }
        if (matchesIgnore(matchers, relativePath, true)) {
          skipped.push({ path: relativePath + '/', reason: 'ignored by pattern' });
          continue;
        }
        await walk(fullPath);
        continue;
      }

      if (entry.isFile()) {
        if (relativePath === OUTPUT_PATH) {
          skipped.push({ path: relativePath, reason: 'output file' });
          continue;
        }
        if (DEFAULT_IGNORED_FILES.has(entry.name)) {
          skipped.push({ path: relativePath, reason: 'lock file' });
          continue;
        }
        if (isBinaryExtension(entry.name)) {
          skipped.push({ path: relativePath, reason: 'binary extension' });
          continue;
        }
        if (matchesIgnore(matchers, relativePath, false)) {
          skipped.push({ path: relativePath, reason: 'ignored by pattern' });
          continue;
        }

        let stat;
        try {
          stat = await fs.stat(fullPath);
        } catch (error) {
          skipped.push({ path: relativePath, reason: `stat error: ${error.message}` });
          continue;
        }

        if (stat.size > maxFileBytes) {
          skipped.push({ path: relativePath, reason: `exceeds maxFileKB (${options.maxFileKB})` });
          continue;
        }

        if (totalBytes + stat.size > maxTotalBytes) {
          skipped.push({ path: relativePath, reason: `exceeds maxTotalMB (${options.maxTotalMB})` });
          continue;
        }

        let buffer;
        try {
          buffer = await fs.readFile(fullPath);
        } catch (error) {
          skipped.push({ path: relativePath, reason: `read error: ${error.message}` });
          continue;
        }

        if (!isLikelyText(buffer)) {
          skipped.push({ path: relativePath, reason: 'non-text or non-utf8' });
          continue;
        }

        const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
        const content = buffer.toString('utf8');
        included.push({
          path: relativePath,
          bytes: stat.size,
          sha256,
          content,
        });
        totalBytes += stat.size;
      }
    }
  }

  await walk(repoRoot);

  included.sort((a, b) => a.path.localeCompare(b.path));

  return { included, skipped, totalBytes };
}

function getGitMetadata() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
  } catch {
    return null;
  }
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const sha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const commitTimeIso = execSync('git show -s --format=%cI HEAD', { encoding: 'utf8' }).trim();
    const dirty = execSync('git status --porcelain', { encoding: 'utf8' }).trim().length > 0;
    return { branch, sha, dirty, commitTimeIso };
  } catch {
    return null;
  }
}

async function main() {
  const ignoreMatchers = await collectIgnoreMatchers();
  const { included, skipped, totalBytes } = await walkRepo(ignoreMatchers);
  const gitMetadata = getGitMetadata();
  const sourceDateEpoch = process.env.SOURCE_DATE_EPOCH;
  const parsedEpoch = sourceDateEpoch ? Number(sourceDateEpoch) : null;
  const generatedAt = Number.isFinite(parsedEpoch)
    ? new Date(parsedEpoch * 1000).toISOString()
    : gitMetadata?.commitTimeIso || new Date(0).toISOString();

  const lines = [];
  lines.push(`# Repo Pack: ${repoName}`);
  lines.push(`Generated: ${generatedAt}`);
  if (gitMetadata) {
    lines.push(`Git: branch=${gitMetadata.branch} sha=${gitMetadata.sha} dirty=${gitMetadata.dirty}`);
  }
  lines.push(`Limits: maxFileKB=${options.maxFileKB}, maxTotalMB=${options.maxTotalMB}`);
  lines.push('');
  lines.push('## File Tree (paths)');
  lines.push('```text');
  for (const file of included) {
    lines.push(file.path);
  }
  lines.push('```');
  lines.push('');
  lines.push('Files (contents)');
  lines.push('');

  for (const file of included) {
    lines.push(`FILE: ${file.path}`);
    lines.push(`\t• bytes: ${file.bytes}`);
    lines.push(`\t• sha256: ${file.sha256}`);
    lines.push('');
    lines.push(file.content);
    if (!file.content.endsWith('\n')) {
      lines.push('');
    }
  }

  lines.push('Summary');
  lines.push('');
  lines.push(`Included files: ${included.length}`);
  lines.push(`Skipped files: ${skipped.length}`);
  lines.push(`Total included bytes: ${totalBytes}`);
  lines.push('');
  lines.push('Skipped (top reasons)');

  const sortedSkipped = [...skipped].sort((a, b) => a.path.localeCompare(b.path));
  if (sortedSkipped.length === 0) {
    lines.push('\t• none');
  } else {
    for (const entry of sortedSkipped) {
      lines.push(`\t• ${entry.path}: ${entry.reason}`);
    }
  }

  lines.push('');

  try {
    await fs.writeFile(path.join(repoRoot, options.out), lines.join('\n'), 'utf8');
  } catch (error) {
    console.error(`Failed to write output: ${error.message}`);
    process.exitCode = 1;
  }
}

main();

FILE: tsconfig.base.json
	• bytes: 299
	• sha256: 76eef7a051a1e79a8ef071f4cf2a5a20a2578df66ee437011c68cb3d463c7387

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": "."
  }
}

Summary

Included files: 24
Skipped files: 3
Total included bytes: 24201

Skipped (top reasons)
	• .git/: ignored directory
	• node_modules/: ignored directory
	• package-lock.json: lock file
