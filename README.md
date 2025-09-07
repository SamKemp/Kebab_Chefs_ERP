# Kebab Chef ERP (Static React + Vite + Tailwind)

A lightweight ERP-style dashboard for Kebab Chef data. Uses static JSON under `public/data` and a small React app to display recipes, stores, and costs.

## Scripts

```powershell
# install deps
npm install

# start dev server
npm run dev

# type check
npm run typecheck

# build
npm run build

# preview production build
npm run preview
```

## Data

You can provide source JSON as either:

1) Aggregated files under `public/data`:
- `ingredients.json`: `[{ id, name, unit }]`
- `recipes.json`: `[{ id, name, category?, ingredients: [{ ingredientId, amount }] }]`
- `stores.json`: `[{ id, name, items: [{ ingredientId, pricePerUnit, stock? }] }]`

2) Foldered files under `src/context` (recommended while editing):
- `src/context/ingredients/*.json`
- `src/context/recipes/*.json` or `src/context/recipies/*.json` (both supported)
- `src/context/stores/*.json`

Use the data build script to aggregate foldered files into `public/data/*.json`:

```powershell
npm run build:data
```

This runs automatically before `npm run dev` and `npm run build`.

On load, the app fetches `public/data`. If missing, built-in fallback samples are used so the UI still works.

## Notes
- Routing is client-side; use the root path when deploying statically (no server rewrites).
- Tailwind scans `index.html` and `src/**/*.{ts,tsx}`.
- The `Table` component provides search and click-to-sort.

## Special Thanks
- Recipe, Ingredient and Store data: [midsubspace/Kebab_Simulator](https://github.com/midsubspace/Kebab_Simulator/)