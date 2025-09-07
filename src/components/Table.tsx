import { useMemo, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'

type Column<T> = {
  key: keyof T
  header: string
  render?: (row: T) => ReactNode
}

type Props<T> = {
  columns: Column<T>[]
  rows: T[]
  searchableKeys?: (keyof T)[]
  placeholder?: string
  onRowClick?: (row: T) => void
}

export default function Table<T extends Record<string, any>>({ columns, rows, searchableKeys = columns.map(c=>c.key), placeholder = 'Search...', onRowClick }: Props<T>) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<{key: keyof T, dir: 'asc' | 'desc'} | null>(null)

  const filtered = useMemo(() => {
    let r = rows
    if (q.trim()) {
      const nq = q.toLowerCase()
      r = r.filter(row => searchableKeys.some(k => String(row[k] ?? '').toLowerCase().includes(nq)))
    }
    if (sort) {
      const { key, dir } = sort
      r = [...r].sort((a,b) => {
        const av = a[key]
        const bv = b[key]
        if (av === bv) return 0
        return (av > bv ? 1 : -1) * (dir === 'asc' ? 1 : -1)
      })
    }
    return r
  }, [rows, q, sort, searchableKeys])

  return (
    <div className="card">
      <div className="card-header">
  <input value={q} onChange={(e: ChangeEvent<HTMLInputElement>)=>setQ(e.target.value)} placeholder={placeholder} className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
      </div>
      <div className="card-body overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-300">
              {columns.map(col => (
                <th key={String(col.key)} className="px-3 py-2 cursor-pointer select-none" onClick={() => setSort((s: {key: keyof T, dir: 'asc' | 'desc'} | null) => s?.key === col.key ? { key: col.key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: col.key, dir: 'asc' })}>
                  <div className="inline-flex items-center gap-1">
                    {col.header}
                    {sort?.key === col.key && (<span className="text-gray-400 dark:text-gray-500">{sort.dir === 'asc' ? '▲' : '▼'}</span>)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className={`border-t border-gray-200 dark:border-gray-800 ${onRowClick ? 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer' : ''}`} onClick={onRowClick ? () => onRowClick(row) : undefined}>
                {columns.map(col => (
                  <td key={String(col.key)} className="px-3 py-2 whitespace-nowrap">
                    {col.render ? col.render(row) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">No results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
