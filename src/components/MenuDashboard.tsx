import { useMemo } from 'react'
import { useData } from '../context/DataContext'
import { useMenu } from '../context/MenuContext'

export default function MenuDashboard() {
  const { recipes, ingredients, stores } = useData()
  const { items, selectedRecipeId, remove, setQuantity, clear, select } = useMenu()

  const recipeById = useMemo(() => new Map(recipes.map(r => [r.id, r])), [recipes])
  const ingById = useMemo(() => new Map(ingredients.map(i => [i.id, i])), [ingredients])

  const selectedRecipe = selectedRecipeId ? recipeById.get(selectedRecipeId) : null

  const formatQty = (n: number) => {
    if (!isFinite(n)) return '0'
    const r = Math.round(n)
    if (Math.abs(n - r) < 1e-6) return String(r)
    return Number(n.toFixed(2)).toString()
  }

  // Aggregate shopping list: ingredientId -> total amount (single known store per ingredient)
  const shopping = useMemo(() => {
    const need = new Map()
    for (const item of items) {
      const r = recipeById.get(item.recipeId)
      if (!r) continue
      for (const ri of r.ingredients) {
        const entry = need.get(ri.ingredientId) || { amount: 0 }
        entry.amount += ri.amount * item.quantity
        need.set(ri.ingredientId, entry)
      }
    }
    const result = []
    for (const [ingredientId, { amount }] of need.entries()) {
      let storeId = 'unknown'
      let storeName = 'Unknown'
      let packPrice = 0
      let packQty = 1
      for (const s of stores) {
        const it = s.items.find(x => x.ingredientId === ingredientId)
        if (it) { storeId = s.id; storeName = s.name; packPrice = it.price; packQty = it.quantity || 1; break }
      }
      const packsNeeded = packQty ? Math.ceil(amount / packQty) : 0
      const subtotal = packsNeeded * packPrice
      result.push({ ingredientId, amount, packsNeeded, packQty, packPrice, subtotal, storeId, storeName })
    }
    // Group by store for view
    const byStore = new Map()
    for (const r of result) {
      if (!byStore.has(r.storeId)) byStore.set(r.storeId, { storeName: r.storeName, items: [], total: 0 })
      byStore.get(r.storeId).items.push(r)
      byStore.get(r.storeId).total += r.subtotal
    }
    return Array.from(byStore.entries()).map(([storeId, v]: any) => ({ storeId, storeName: v.storeName, items: v.items, total: v.total }))
  }, [items, recipeById, stores])

  const grandTotal = useMemo(() => shopping.reduce((sum: number, s: any) => sum + (s.total || 0), 0), [shopping])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="card lg:col-span-1">
        <div className="card-header">
          <div className="font-medium">Menu</div>
          <button className="text-sm text-red-600 hover:underline" onClick={() => clear()}>Clear</button>
        </div>
        <div className="card-body space-y-2">
          {items.length === 0 && <div className="text-sm text-gray-500 dark:text-gray-400">No recipes on the menu.</div>}
          {items.map(i => {
            const r = recipeById.get(i.recipeId)
            if (!r) return null
            return (
              <div key={i.recipeId} className="flex items-center justify-between gap-2">
                <button className={`text-left flex-1 ${selectedRecipeId === i.recipeId ? 'font-semibold' : ''}`} onClick={() => select(i.recipeId)}>{r.name}</button>
                <input type="number" className="w-16 border rounded px-2 py-1 text-sm dark:bg-gray-900 dark:border-gray-700" value={i.quantity} min={1} onChange={e => setQuantity(i.recipeId, Number(e.target.value))} />
                <button className="text-sm text-gray-600 hover:underline dark:text-gray-300" onClick={() => remove(i.recipeId)}>Remove</button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card lg:col-span-1">
        <div className="card-header"><div className="font-medium">Selected Recipe Steps</div></div>
        <div className="card-body">
          {!selectedRecipe && <div className="text-sm text-gray-500 dark:text-gray-400">Select a recipe from the menu.</div>}
          {selectedRecipe && (
            <ol className="space-y-3 list-decimal pl-5">
              {selectedRecipe.steps?.map((s, idx) => (
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
          )}
        </div>
      </div>

      <div className="card lg:col-span-1">
        <div className="card-header"><div className="font-medium">Shopping List (by Store)</div></div>
        <div className="card-body space-y-4">
          {shopping.length === 0 && <div className="text-sm text-gray-500 dark:text-gray-400">Add recipes to generate a shopping list.</div>}
          {shopping.map(store => (
            <div key={store.storeId}>
              <div className="font-medium mb-2">{store.storeName} <span className="text-gray-500 dark:text-gray-400">— € {store.total.toFixed(2)}</span></div>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {store.items.map((it: any, idx: number) => (
                  <li key={idx} className="flex items-center justify-between gap-2">
                    <div>
                      {ingById.get(it.ingredientId)?.name || it.ingredientId}
                      {(() => {
                        const unit = ingById.get(it.ingredientId)?.unit
                        return (
                          <span className="text-gray-500 dark:text-gray-400"> — need {formatQty(it.amount)}{unit ? ` ${unit}` : ''} (pack {formatQty(it.packQty)}{unit ? ` ${unit}` : ''})</span>
                        )
                      })()}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">{it.packsNeeded} × € {it.packPrice.toFixed(2)} = € {it.subtotal.toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {shopping.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-2 flex items-center justify-between text-sm">
              <div className="font-medium">Grand Total</div>
              <div className="font-semibold">€ {grandTotal.toFixed(2)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
