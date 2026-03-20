import React, { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../context/AuthContext"
import { registerUser } from "../api/auth"


export default function RegisterPage() {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError(null)
        try {
            const result = await registerUser({ email, password })
            login(result)
            navigate('/')
        } catch {
            setError('Registration failed')
        }
    }

    return (
        <div>
            <h1>Register</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type='submit'>Register</button>
            </form>
        </div>
    )
}