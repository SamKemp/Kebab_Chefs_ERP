import { useData } from '../context/DataContext'
import MenuDashboard from '../components/MenuDashboard'

export default function Dashboard() {
  const { recipes, stores, ingredients } = useData()
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card"><div className="card-body"><div className="text-sm text-gray-500 dark:text-gray-400">Recipes</div><div className="text-3xl font-semibold">{recipes.length}</div></div></div>
        <div className="card"><div className="card-body"><div className="text-sm text-gray-500 dark:text-gray-400">Stores</div><div className="text-3xl font-semibold">{stores.length}</div></div></div>
        <div className="card"><div className="card-body"><div className="text-sm text-gray-500 dark:text-gray-400">Ingredients</div><div className="text-3xl font-semibold">{ingredients.length}</div></div></div>
      </div>
      <MenuDashboard />
    </div>
  )
}
