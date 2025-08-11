import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import AppShell from './shell/AppShell'
import Landing from './views/Landing'
import Learn from './views/Learn'
import Progress from './views/Progress'
import SignIn from './views/SignIn'
import SignUp from './views/SignUp'
import Dashboard from './views/Dashboard'
import RequireAuth from './shell/RequireAuth'
 
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'learn', element: <Learn /> },
      { path: 'progress', element: <Progress /> },
      { path: 'dashboard', element: (
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      ) },
      { path: 'signin', element: <SignIn /> },
      { path: 'signup', element: <SignUp /> },
    ],
  },
])
 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
