import { Navigate } from 'react-router'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'


function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    if (!user) return <Navigate to='/login' replace />
    return <>{children}</>
}

export default ProtectedRoute