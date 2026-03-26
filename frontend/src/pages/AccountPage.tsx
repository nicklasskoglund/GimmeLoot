import { useState } from 'react'
import { updateUser, deleteUser } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function AccountPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError(null)
    if (!currentPassword) {
      setError('Please enter your current password.')
      return
    }
    if (!email && !password && !username) {
      setError('Please fill in at least one field to update.')
      return
    }
    const data: { current_password: string; email?: string; password?: string; username?: string } = {
      current_password: currentPassword
    }
    if (email) data.email = email
    if (password) data.password = password
    if (username) data.username = username
    setLoading(true)
    try {
      await updateUser(data)
      toast.success('Account updated!')
      setEmail('')
      setPassword('')
      setCurrentPassword('')
      setUsername('')
    } catch {
      setError('Failed to update account. Check your current password.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account?')) return
    try {
      await deleteUser()
      logout()
      navigate('/login')
      toast.success('Account deleted')
    } catch {
      toast.error('Failed to delete account.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <div className="flex flex-col items-center gap-2 text-center">
          <Settings className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-sm text-muted-foreground">Update your email or password</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Current password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="border-t border-border pt-4 flex flex-col gap-4">
              <p className="text-xs text-muted-foreground">Fill in one or both fields below to update</p>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">New username</label>
                <Input
                  type="text"
                  placeholder="coolplayer99"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">New email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">New password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </div>

        <div className="border-t border-border pt-4">
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleDeleteAccount}
          >
            Delete account
          </Button>
        </div>

      </div>
    </div>
  )
}

export default AccountPage