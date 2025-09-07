import React, { createContext, useContext, useEffect, useState } from 'react'
import type { DataState, Ingredient, Recipe, Store } from '../types'

type DataContextValue = DataState & {
  reload: () => Promise<void>
}

const defaultData: DataState = {
  ingredients: [
    { id: 'beef', name: 'Beef', unit: 'kg' },
    { id: 'onion', name: 'Onion', unit: 'pc' },
    { id: 'tomato', name: 'Tomato', unit: 'pc' },
    { id: 'spice', name: 'Spice Mix', unit: 'g' },
  ],
  recipes: [
    {
      id: 'kebab-wrap',
      name: 'Kebab Wrap',
      category: 'Wraps',
      ingredients: [
        { ingredientId: 'beef', amount: 0.25 },
        { ingredientId: 'onion', amount: 1 },
        { ingredientId: 'tomato', amount: 1 },
        { ingredientId: 'spice', amount: 10 },
      ],
    },
  ],
  stores: [
    {
      id: 'main-market',
      name: 'Main Market',
      items: [
        { ingredientId: 'beef', price: 12, quantity: 1 },
        { ingredientId: 'onion', price: 0.4, quantity: 1 },
        { ingredientId: 'tomato', price: 0.5, quantity: 1 },
        { ingredientId: 'spice', price: 0.02, quantity: 1 },
      ],
    },
  ],
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

async function getJSON<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(path)
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
      getJSON<Ingredient[]>('/data/ingredients.json', defaultData.ingredients),
      getJSON<Recipe[]>('/data/recipes.json', defaultData.recipes),
      getJSON<Store[]>('/data/stores.json', defaultData.stores),
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
