import React, { useState } from "react"
import { useNavigate, Link } from 'react-router'
import { useAuth } from "../context/AuthContext"
import { registerUser } from "../api/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Gamepad2, Loader2 } from 'lucide-react'


export default function RegisterPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await registerUser({ email, password, username })
      login(result)
      navigate('/')
    } catch {
      setError('Registration failed. Try a different email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <div className="flex flex-col items-center gap-2 text-center">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Join GimmeLoot and start saving giveaways</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Username</label>
              <Input
                type="text"
                placeholder="coolplayer99"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Creating account...' : 'Create account'}
            </Button>

          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}