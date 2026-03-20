import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'


interface AuthUser {
    user_id: string
    access_token: string
}

interface AuthContextType {
    user: AuthUser | null
    login: (user: AuthUser) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)

    const login = (user: AuthUser) => setUser(user)
    const logout = () => setUser(null)

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
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