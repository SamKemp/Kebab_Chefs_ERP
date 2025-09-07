import { Link, NavLink, Outlet } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'

export default function App() {
  const { theme, toggle } = useTheme()
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <header className="border-b bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="container-erp py-4 flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold text-brand-700 dark:text-brand-400">Kebab Chefs ERP</Link>
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
        <div className="container-erp py-4 text-xs text-gray-500 dark:text-gray-400">Kebab Chefs ERP | v0.0.1 {new Date().toISOString()}</div>
        <div className="container-erp flex justify-end">
          <a
            href="https://github.com/SamKemp/Kebab_Chefs_ERP/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-brand-700 dark:text-gray-400 dark:hover:text-brand-400"
            aria-label="GitHub Repository"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.867 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.579.688.481C19.135 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/>
            </svg>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
