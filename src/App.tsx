import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import LoginForm from '~/components/forms/login'
import AuthLayout from '~/layouts/auth'

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    )
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
