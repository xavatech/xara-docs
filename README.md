# Xara API Documentation

Developer documentation for the Xara Business API, built with Docus.

## Local development

```bash
pnpm install
pnpm dev
```

The site is available at `http://localhost:3000`.

## Production build

```bash
pnpm build
pnpm preview
```

Documentation pages live in `content/`. Contextual request and response examples are defined in `app/data/api-examples.ts` and rendered by `app/components/ApiExamplePanel.vue`.
