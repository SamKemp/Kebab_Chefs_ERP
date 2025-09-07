import { Link, NavLink, Outlet } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'

export default function App() {
  const { theme, toggle } = useTheme()
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="border-b bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="container-erp py-4 flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold text-brand-700 dark:text-brand-400">Kebab Chef ERP</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" end className={({isActive})=>`px-3 py-1 rounded-md ${isActive? 'bg-brand-50 text-brand-800 dark:bg-gray-800 dark:text-brand-200' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Dashboard</NavLink>
            <NavLink to="/ingredients" className={({isActive})=>`px-3 py-1 rounded-md ${isActive? 'bg-brand-50 text-brand-800 dark:bg-gray-800 dark:text-brand-200' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Ingredients</NavLink>
            <NavLink to="/recipies" className={({isActive})=>`px-3 py-1 rounded-md ${isActive? 'bg-brand-50 text-brand-800 dark:bg-gray-800 dark:text-brand-200' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Recipes</NavLink>
            {/* <NavLink to="/stores" className={({isActive})=>`px-3 py-1 rounded-md ${isActive? 'bg-brand-50 text-brand-800 dark:bg-gray-800 dark:text-brand-200' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>Stores</NavLink> */}
          </nav>
          <div className="flex-1" />
          <button onClick={toggle} className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800" aria-label="Toggle dark mode">
            {theme === 'dark' ? 'Light' : 'Dark'} mode
          </button>
        </div>
      </header>
      <main className="container-erp py-6 flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="container-erp py-4 text-xs text-gray-500 dark:text-gray-400">Kebab Chef ERP</div>
      </footer>
    </div>
  )
}
