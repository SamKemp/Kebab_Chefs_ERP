import React, { createContext, useContext, useEffect, useState } from 'react'
import type { DataState, Ingredient, Recipe, Store } from '../types'

type DataContextValue = DataState & {
  reload: () => Promise<void>
}

const defaultData: DataState = {
  ingredients: [],
  recipes: [],
  stores: [],
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

async function getJSON<T>(path: string, fallback: T): Promise<T> {
  try {
    const base = (import.meta as any).env?.BASE_URL || ''
    const url = base + path;
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed fetch')
    return (await res.json()) as T
  } catch {
    return fallback
  }
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DataState>(defaultData)

  const reload = async () => {
    const [ingredients, recipes, stores] = await Promise.all([
      getJSON<Ingredient[]>('data/ingredients.json', defaultData.ingredients),
      getJSON<Recipe[]>('data/recipes.json', defaultData.recipes),
      getJSON<Store[]>('data/stores.json', defaultData.stores),
    ])
    setData({ ingredients, recipes, stores })
  }

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DataContext.Provider value={{ ...data, reload }}>{children}</DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
