import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RequireAuth = ({ accountType }) => {
  const location = useLocation()
  const { isAuthenticated, accountType: currentAccountType, isInitializing } = useAuth()

  if (isInitializing) {
    return null
  }

  if (!isAuthenticated) {
    const nextPath = accountType === 'admin' ? '/admin/login' : '/login'

    return (
      <Navigate
        to={nextPath}
        replace
        state={{
          from: location.pathname,
        }}
      />
    )
  }

  if (accountType && currentAccountType !== accountType) {
    return <Navigate to={currentAccountType === 'admin' ? '/admin' : '/owner'} replace />
  }

  return <Outlet />
}

export default RequireAuth