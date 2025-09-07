import { useData } from '../context/DataContext'
import { useMemo, useState } from 'react'
import { useMenu } from '../context/MenuContext'
import { useNavigate, useParams } from 'react-router-dom'

export default function RecipesPage() {
  const { recipes, ingredients } = useData()
  const { items, add: addToMenu, setQuantity } = useMenu()

  const qtyById = useMemo(() => Object.fromEntries(items.map(i => [i.recipeId, i.quantity])) as Record<string, number>, [items])

  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    if (!q.trim()) return recipes
    const nq = q.toLowerCase()
    return recipes.filter(r => (r.name.toLowerCase().includes(nq) || (r.category ?? '').toLowerCase().includes(nq)))
  }, [recipes, q])

  const params = useParams()
  const navigate = useNavigate()
  // Support multiple param names (id, recipe_slug, slug)
  const routeSelected = (params.id as string | undefined) ?? (params as any).recipe_slug ?? (params as any).slug ?? null

  const selectedRecipe = useMemo(() => recipes.find(r => r.id === routeSelected) ?? null, [recipes, routeSelected])
  const ingById = useMemo(() => new Map(ingredients.map(i => [i.id, i])), [ingredients])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Recipes</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sidebar: Recipe list */}
        <div className="card lg:col-span-1">
          <div className="card-header">
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search recipes..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="card-body">
            {filtered.length === 0 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">No recipes.</div>
            )}
            <ul className="space-y-2">
              {filtered.map(r => {
                const qty = qtyById[r.id] ?? 0
                const isSel = r.id === routeSelected
                return (
                  <li key={r.id} className={`flex items-center justify-between gap-2 px-2 py-2 rounded-md ${isSel ? 'bg-brand-50 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    <button className={`text-left flex-1 ${isSel ? 'font-semibold' : ''}`} onClick={() => navigate(`/recipe/${r.id}`)}>
                      <div>{r.name}</div>
                      {r.category && <div className="text-xs text-gray-500 dark:text-gray-400">{r.category}</div>}
                    </button>
                    <div className="inline-flex items-center gap-2">
                      {qty > 0 ? (
                        <>
                          <button
                            className="px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            onClick={() => setQuantity(r.id, qty - 1)}
                            aria-label={`Decrease ${r.name}`}
                          >
                            -
                          </button>
                          <span className="min-w-6 text-center">{qty}</span>
                          <button
                            className="px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"
                            onClick={() => addToMenu(r.id, 1)}
                            aria-label={`Increase ${r.name}`}
                          >
                            +
                          </button>
                        </>
                      ) : (
                        <button
                          className="px-2 py-1 rounded-md bg-brand-600 text-white hover:bg-brand-700"
                          onClick={() => addToMenu(r.id, 1)}
                          aria-label={`Add ${r.name}`}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* Details: Ingredients and Steps */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ingredients column */}
          <div className="card">
            <div className="card-header"><div className="font-medium">{selectedRecipe ? selectedRecipe.name : 'Ingredients'}</div></div>
            <div className="card-body">
              {!selectedRecipe && <div className="text-sm text-gray-500 dark:text-gray-400">Select a recipe to view ingredients.</div>}
              {selectedRecipe && (
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  {selectedRecipe.ingredients.map((ri, idx) => {
                    const ing = ingById.get(ri.ingredientId)
                    const unit = ing?.unit ? ` ${ing.unit}` : ''
                    return (
                      <li key={idx} className="flex items-center justify-between gap-2">
                        <div>{ing?.name ?? ri.ingredientId}</div>
                        <div className="text-gray-500 dark:text-gray-400">{ri.amount}{unit}</div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Steps column */}
          <div className="card">
            <div className="card-header"><div className="font-medium">{selectedRecipe ? `${selectedRecipe.name} Steps` : 'Steps'}</div></div>
            <div className="card-body">
              {!selectedRecipe && <div className="text-sm text-gray-500 dark:text-gray-400">Select a recipe to view steps.</div>}
              {selectedRecipe && (
                selectedRecipe.steps?.length ? (
                  <ol className="space-y-3 list-decimal pl-5">
                    {selectedRecipe.steps.map((s, idx) => (
                      <li key={idx}>
                        <div className="font-medium">{s.stepHeader}</div>
                        {s.list?.length ? (
                          <ul className="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300">
                            {s.list.map((l, i) => (<li key={i}>{l}</li>))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">No steps for this recipe.</div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
