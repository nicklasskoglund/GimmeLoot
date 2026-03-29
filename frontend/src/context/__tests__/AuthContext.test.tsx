import { render, screen, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'
import * as client from '../../api/client'

vi.mock('../../api/client', () => ({
  default: {},
  setAuthToken: vi.fn(),
}))


function TestConsumer() {
  const { user, login, logout, updateUser } = useAuth()
  return (
    <div>
      <span data-testid="username">{user?.username ?? 'null'}</span>
      <button onClick={() => login({ user_id: '1', access_token: 'tok', username: 'nick' })}>login</button>
      <button onClick={logout}>logout</button>
      <button onClick={() => updateUser({ username: 'updated' })}>update</button>
    </div>
  )
}


describe('AuthContext', () => {
  it('starts with no user', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    expect(screen.getByTestId('username').textContent).toBe('null')
  })

  it('login sets user and calls setAuthToken', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    act(() => { screen.getByText('login').click() })
    expect(screen.getByTestId('username').textContent).toBe('nick')
    expect(client.setAuthToken).toHaveBeenCalledWith('tok')
  })

  it('logout clears user', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    act(() => { screen.getByText('login').click() })
    act(() => { screen.getByText('logout').click() })
    expect(screen.getByTestId('username').textContent).toBe('null')
  })

  it('updateUser merges data into existing user', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    act(() => { screen.getByText('login').click() })
    act(() => { screen.getByText('update').click() })
    expect(screen.getByTestId('username').textContent).toBe('updated')
  })
})