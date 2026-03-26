import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { setAuthToken } from '../api/client'


interface AuthUser {
    user_id: string
    access_token: string
    username: string
}

interface AuthContextType {
    user: AuthUser | null
    login: (user: AuthUser) => void
    logout: () => void
    updateUser: (data: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)

    const login = (user: AuthUser) => {
        setAuthToken(user.access_token)
        setUser(user)
    }

    const logout = () => {
        setAuthToken(null)
        setUser(null)
    }

    const updateUser = (data: Partial<AuthUser>) => {
        setUser(prev => prev ? { ...prev, ...data } : null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}