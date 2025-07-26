import React from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'

import LoginForm from '~/components/forms/login'
import PATH from '~/constants/path'
import { AppContext } from '~/contexts/app.context'
import AuthLayout from '~/layouts/auth'
import DashboardLayout from '~/layouts/dashboard'
import DashboardPage from '~/pages/dashboard'
import HomePage from '~/pages/home'

const ProtectedRoute = () => {
  const { isAuthenticated } = React.useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to={PATH.LOGIN} />
}

const RejectedRoute = () => {
  const { isAuthenticated } = React.useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to={PATH.DASHBOARD} />
}

const router = createBrowserRouter([
  {
    path: PATH.HOME,
    element: <HomePage />
  },
  {
    path: '',
    element: <ProtectedRoute />,
    children: [
      {
        path: PATH.DASHBOARD,
        element: (
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        )
      }
    ]
  },
  {
    path: '',
    element: <RejectedRoute />,
    children: [
      {
        path: PATH.LOGIN,
        element: (
          <AuthLayout>
            <LoginForm />
          </AuthLayout>
        )
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
