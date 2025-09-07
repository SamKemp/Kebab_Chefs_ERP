import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type MenuItem = { recipeId: string; quantity: number }

type MenuContextValue = {
  items: MenuItem[]
  selectedRecipeId: string | null
  add: (recipeId: string, quantity?: number) => void
  remove: (recipeId: string) => void
  setQuantity: (recipeId: string, quantity: number) => void
  clear: () => void
  select: (recipeId: string | null) => void
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined)
const KEY = 'kebab_chef_menu_v1'

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        // Support both full object and legacy array-only formats
        if (Array.isArray(parsed)) {
          setItems(parsed)
        } else {
          if (Array.isArray(parsed?.items)) setItems(parsed.items)
          if (typeof parsed?.selectedRecipeId === 'string' || parsed?.selectedRecipeId === null) setSelectedRecipeId(parsed.selectedRecipeId)
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(KEY, JSON.stringify({ items, selectedRecipeId }))
  }, [items, selectedRecipeId, hydrated])

  const add = useCallback((recipeId: string, quantity = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.recipeId === recipeId)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity }
        return next
      }
      return [...prev, { recipeId, quantity }]
    })
    setSelectedRecipeId(recipeId)
  }, [])

  const remove = useCallback((recipeId: string) => {
    setItems(prev => prev.filter(i => i.recipeId !== recipeId))
    setSelectedRecipeId(s => (s === recipeId ? null : s))
  }, [])

  const setQuantity = useCallback((recipeId: string, quantity: number) => {
    setItems(prev => prev.map(i => i.recipeId === recipeId ? { ...i, quantity: Math.max(0, quantity) } : i).filter(i => i.quantity > 0))
  }, [])

  const clear = useCallback(() => {
    setItems([])
    setSelectedRecipeId(null)
  }, [])

  const select = useCallback((recipeId: string | null) => setSelectedRecipeId(recipeId), [])

  const value = useMemo(() => ({ items, selectedRecipeId, add, remove, setQuantity, clear, select }), [items, selectedRecipeId, add, remove, setQuantity, clear, select])
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export function useMenu() {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenu must be used within MenuProvider')
  return ctx
}
