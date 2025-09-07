import Table from '../components/Table'
import { useData } from '../context/DataContext'
import { useMemo, useState } from 'react'
import { useMenu } from '../context/MenuContext'

export default function RecipesPage() {
  const { recipes } = useData()
  const { items, add: addToMenu, setQuantity } = useMenu()

  type Row = { id: string; name: string; category: string; qty: number }
  const qtyById = useMemo(() => Object.fromEntries(items.map(i => [i.recipeId, i.quantity])) as Record<string, number>, [items])
  const rows: Row[] = recipes.map(r => ({ id: r.id, name: r.name, category: r.category ?? '', qty: qtyById[r.id] ?? 0 }))

  const [selected, setSelected] = useState<string | null>(rows[0]?.id ?? null)
  const selectedRecipe = useMemo(() => recipes.find(r => r.id === selected), [recipes, selected])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Recipes</h1>
      <Table<Row>
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'category', header: 'Category' },
          {
            key: 'qty',
            header: 'Menu',
            render: (row: Row) => (
              <div className="inline-flex items-center gap-2">
                {row.qty > 0 ? (
                  <>
                    <button
                      className="px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                      onClick={(e) => { e.stopPropagation(); setQuantity(row.id, row.qty - 1) }}
                    >
                      -
                    </button>
                    <span className="min-w-6 text-center">{row.qty}</span>
                    <button
                      className="px-2 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
                      onClick={(e) => { e.stopPropagation(); addToMenu(row.id, 1) }}
                    >
                      +
                    </button>
                  </>
                ) : (
                  <button
                    className="px-2 py-1 rounded-md bg-brand-600 text-white hover:bg-brand-700"
                    onClick={(e) => { e.stopPropagation(); addToMenu(row.id, 1) }}
                  >
                    Add
                  </button>
                )}
              </div>
            ),
          },
        ]}
        rows={rows}
        searchableKeys={['name','category']}
        placeholder="Search recipes..."
        onRowClick={(r: any) => setSelected(r.id)}
      />
      {selectedRecipe && (
        <div className="card">
          <div className="card-header">
            <div className="font-medium">Steps — {selectedRecipe.name}</div>
          </div>
          <div className="card-body">
            {selectedRecipe.steps?.length ? (
              <ol className="space-y-3 list-decimal pl-5">
                {selectedRecipe.steps.map((s, idx) => (
                  <li key={idx}>
                    <div className="font-medium">{s.stepHeader}</div>
                    {s.list?.length ? (
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {s.list.map((l, i) => (<li key={i}>{l}</li>))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-sm text-gray-500">No steps for this recipe.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
