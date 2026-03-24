import { useState } from 'react'
import { updateUser } from '../api/auth'


function AccountPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setMessage(null)
        setError(null)

        const data: { current_password: string; email?: string; password?: string } = {
            current_password: currentPassword
        }
        if (email) data.email = email
        if (password) data.password = password

        if (!currentPassword) {
            setError('Please enter your current password.')
            return
        }

        if (!email && !password) {
            setError('Please fill in at least one field.')
            return
        }

        try {
            await updateUser(data)
            setMessage('Account updated successfully.')
            setEmail('')
            setPassword('')
            setCurrentPassword('')
        } catch {
            setError('Failed to update account.')
        }
    }

    return (
        <div>
            <h1>Account Settings</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type='password'
                    placeholder='Current password'
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                />
                <input
                    type='email'
                    placeholder='New email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='New password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type='submit'>Update</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}
        </div>
    )
}

export default AccountPage