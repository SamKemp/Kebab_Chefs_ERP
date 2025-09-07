import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import { DataProvider } from './context/DataContext'
import { MenuProvider } from './context/MenuContext'
import { ThemeProvider } from './context/ThemeContext'
import Dashboard from './pages/Dashboard'
import IngredientsPage from './pages/IngredientsPage'
import RecipesPage from './pages/RecipesPage'
import StoresPage from './pages/StoresPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
        { index: true, element: <Dashboard /> },
        { path: 'ingredients', element: <IngredientsPage /> },
        { path: 'recipes', element: <RecipesPage /> },
        { path: 'stores', element: <StoresPage /> },
    ],
  },
], { basename: (import.meta as any).env?.BASE_URL || '/' })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <DataProvider>
        <MenuProvider>
          <RouterProvider router={router} />
        </MenuProvider>
      </DataProvider>
    </ThemeProvider>
  </React.StrictMode>
)
