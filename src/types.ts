export type Ingredient = {
  id: string
  name: string
  unit: 'g' | 'kg' | 'ml' | 'l' | 'pc'
}

export type RecipeIngredient = {
  ingredientId: string
  amount: number
}

export type Recipe = {
  id: string
  name: string
  category?: string
  ingredients: RecipeIngredient[]
  steps?: { stepHeader: string; list: string[] }[]
}

export type StoreItem = {
  ingredientId: string
  price: number
  quantity: number
  stock?: number
}

export type Store = {
  id: string
  name: string
  items: StoreItem[]
}

export type DataState = {
  ingredients: Ingredient[]
  recipes: Recipe[]
  stores: Store[]
}
