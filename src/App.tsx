import { Link, NavLink, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container-erp py-4 flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold text-brand-700">Kebab Chef ERP</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" end className={({isActive})=>`px-3 py-1 rounded-md ${isActive? 'bg-brand-50 text-brand-800' : 'hover:bg-gray-100'}`}>Dashboard</NavLink>
            <NavLink to="/ingredients" className={({isActive})=>`px-3 py-1 rounded-md ${isActive? 'bg-brand-50 text-brand-800' : 'hover:bg-gray-100'}`}>Ingredients</NavLink>
            <NavLink to="/recipes" className={({isActive})=>`px-3 py-1 rounded-md ${isActive? 'bg-brand-50 text-brand-800' : 'hover:bg-gray-100'}`}>Recipes</NavLink>
            <NavLink to="/stores" className={({isActive})=>`px-3 py-1 rounded-md ${isActive? 'bg-brand-50 text-brand-800' : 'hover:bg-gray-100'}`}>Stores</NavLink>
          </nav>
        </div>
      </header>
      <main className="container-erp py-6 flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-white">
        <div className="container-erp py-4 text-xs text-gray-500">Kebab Chef ERP</div>
      </footer>
    </div>
  )
}
