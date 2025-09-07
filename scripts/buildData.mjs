import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

const SRC_CONTEXT = path.join(root, 'src', 'context')
const DEST_DIR = path.join(root, 'public', 'data')

async function exists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function readJsonFiles(dir) {
  if (!(await exists(dir))) return []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = entries.filter(e => e.isFile() && e.name.toLowerCase().endsWith('.json'))
  const out = []
  for (const f of files) {
    const full = path.join(dir, f.name)
    const raw = await fs.readFile(full, 'utf-8')
    try {
      out.push(JSON.parse(raw))
    } catch (e) {
      console.warn(`Skipping invalid JSON: ${full}\n${e}`)
    }
  }
  return out
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

function sortByKey(arr, key) {
  return arr.sort((a, b) => {
    const av = String(a?.[key] ?? '')
    const bv = String(b?.[key] ?? '')
    return av.localeCompare(bv)
  })
}

async function main() {
  const ingredientsDir = path.join(SRC_CONTEXT, 'ingredients')
  const recipesDir = (await exists(path.join(SRC_CONTEXT, 'recipes'))) ? path.join(SRC_CONTEXT, 'recipes') : path.join(SRC_CONTEXT, 'recipies')
  const storesDir = path.join(SRC_CONTEXT, 'stores')

  const [rawIngredients, rawRecipes, rawStores] = await Promise.all([
    readJsonFiles(ingredientsDir),
    readJsonFiles(recipesDir),
    readJsonFiles(storesDir),
  ])

  // Normalize ingredients to app schema
  const ingredients = rawIngredients.map(i => ({
    id: i.slug ?? i.id ?? i.name?.toLowerCase().replace(/\s+/g, '_'),
    name: i.name,
    unit: (i.measure_abbreviation || i.unit || ''),
    _store_slug: i.store_slug,
    _price: i.price ?? i.pricePerUnit ?? null,
    _quantity: i.quantity ?? 1,
  }))

  // Build store items from ingredient pricing grouped by store_slug
  const itemsByStore = new Map()
  for (const ing of ingredients) {
    if (!ing._store_slug || ing._price == null) continue
    if (!itemsByStore.has(ing._store_slug)) itemsByStore.set(ing._store_slug, [])
    itemsByStore.get(ing._store_slug).push({ ingredientId: ing.id, price: ing._price, quantity: ing._quantity || 1 })
  }

  // Normalize stores and attach items
  const stores = rawStores.map(s => ({
    id: s.slug ?? s.id ?? s.name?.toLowerCase().replace(/\s+/g, '_'),
    name: s.name,
    items: sortByKey(itemsByStore.get(s.slug) || [], 'ingredientId'),
  }))

  // Normalize recipes: map ingredientSlug -> ingredientId
  const ingIdBySlug = new Map(ingredients.map(i => [i.id, i.id]))
  const recipes = rawRecipes.map(r => ({
    id: r.slug ?? r.id ?? r.name?.toLowerCase().replace(/\s+/g, '_'),
    name: r.name,
    category: r.category ?? r.type ?? 'General',
    ingredients: Array.isArray(r.ingredients) ? r.ingredients.map(ri => ({
      ingredientId: ingIdBySlug.get(ri.ingredientSlug) || ri.ingredientSlug || ri.ingredientId,
      amount: ri.amount ?? ri.qty ?? 0,
    })) : [],
    steps: Array.isArray(r.steps) ? r.steps.map(s => ({ stepHeader: s.stepHeader ?? s.header ?? '', list: Array.isArray(s.list) ? s.list : [] })) : undefined,
  }))

  await ensureDir(DEST_DIR)

  const outputs = [
    { name: 'ingredients.json', data: sortByKey(ingredients.map(({ _store_slug, _price, _quantity, ...rest }) => rest), 'name') },
    { name: 'recipes.json', data: sortByKey(recipes, 'name') },
    { name: 'stores.json', data: sortByKey(stores, 'name') },
  ]

  for (const out of outputs) {
    const dest = path.join(DEST_DIR, out.name)
    await fs.writeFile(dest, JSON.stringify(out.data, null, 2), 'utf-8')
    console.log(`Wrote ${dest} (${out.data.length} records)`) // eslint-disable-line no-console
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
