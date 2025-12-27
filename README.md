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

## Demo

The demo app (`apps/demo`) provides manual QA and fast design iteration:

- **Embed Showcase**: Tests embed functionality with real JSON files
- **Design Sandbox**: Fast-iteration design testing with in-memory fixtures (best for component styling work)

See [`apps/demo/README.md`](apps/demo/README.md) for detailed usage instructions, including how to add fixtures and customize theming.
