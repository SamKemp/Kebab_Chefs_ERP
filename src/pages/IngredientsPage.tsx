import Table from '../components/Table'
import { useData } from '../context/DataContext'

type Row = { name: string; unit: string; packPrice: number | null; packQty: number | null; store: string; unitPrice: number | null }

export default function IngredientsPage() {
  const { ingredients, stores } = useData()
  const map: Record<string, { store: string; price: number; quantity: number } | undefined> = {}
  for (const s of stores) {
    for (const it of s.items) {
      map[it.ingredientId] = { store: s.name, price: it.price, quantity: it.quantity }
    }
  }

  const rows: Row[] = ingredients.map(i => {
    const info = map[i.id]
    const unitPrice = info && info.quantity ? info.price / info.quantity : null
    return { name: i.name, unit: i.unit, packPrice: info?.price ?? null, packQty: info?.quantity ?? null, store: info?.store ?? '—', unitPrice }
  })

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Ingredients</h1>
      <Table<Row>
        columns={[
          { key: 'name', header: 'Ingredient' },
          { key: 'unit', header: 'Unit' },
          { key: 'packPrice', header: 'Pack Price', render: (r) => r.packPrice == null ? '—' : `€ ${r.packPrice.toFixed(2)}` },
          { key: 'packQty', header: 'Pack Qty', render: (r) => r.packQty == null ? '—' : `${r.packQty} ${r.unit}` },
          { key: 'unitPrice', header: 'Unit Price', render: (r) => r.unitPrice == null ? '—' : `€ ${(r.unitPrice).toFixed(2)} / ${r.unit}` },
          { key: 'store', header: 'Store' },
        ]}
        rows={rows}
        searchableKeys={['name','unit','store']}
        placeholder="Search ingredients..."
      />
    </div>
  )
}
