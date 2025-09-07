import Table from '../components/Table'
import { useData } from '../context/DataContext'

type Row = { name: string; items: number }

export default function StoresPage() {
  const { stores } = useData()
  const rows: Row[] = stores.map(s => ({ name: s.name, items: s.items.length }))

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Stores</h1>
      <Table<Row>
        columns={[
          { key: 'name', header: 'Store' },
          { key: 'items', header: 'Items' },
        ]}
        rows={rows}
        searchableKeys={['name']}
        placeholder="Search stores..."
      />
    </div>
  )
}
