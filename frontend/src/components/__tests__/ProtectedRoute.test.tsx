import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import ProtectedRoute from '../ProtectedRoute'
import * as AuthContext from '../../context/AuthContext'

vi.mock('../../context/AuthContext')


describe('ProtectedRoute', () => {
  it('redirects to /login when user is not logged in', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <ProtectedRoute>
          <p>Protected content</p>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('renders children when user is logged in', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { user_id: '123', access_token: 'tok', username: 'nick' },
      login: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    })

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Protected content</p>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Protected content')).toBeInTheDocument()
  })
})