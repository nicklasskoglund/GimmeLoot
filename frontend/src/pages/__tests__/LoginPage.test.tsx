import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import LoginPage from '../LoginPage'
import * as AuthContext from '../../context/AuthContext'
import * as authApi from '../../api/auth'

const mockNavigate = vi.fn()

vi.mock('../../context/AuthContext')
vi.mock('../../api/auth')
vi.mock('react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router')>()),
  useNavigate: () => mockNavigate,
}))

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )
}

describe('LoginPage', () => {
  const mockLogin = vi.fn()

  beforeEach(() => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null,
      login: mockLogin,
      logout: vi.fn(),
      updateUser: vi.fn(),
    })
  })

  it('renders email and password fields', () => {
    renderLoginPage()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows error message on failed login', async () => {
    vi.spyOn(authApi, 'loginUser').mockRejectedValue(new Error('Unauthorized'))
    renderLoginPage()

    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'test@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'wrongpassword')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument()
  })

  it('calls login on successful submit', async () => {
    const fakeUser = { message: 'ok', user_id: '1', access_token: 'tok', username: 'nick' }
    vi.spyOn(authApi, 'loginUser').mockResolvedValue(fakeUser)
    renderLoginPage()

    await userEvent.type(screen.getByPlaceholderText('you@example.com'), 'test@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'correctpassword')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(mockLogin).toHaveBeenCalledWith(fakeUser)
  })
})