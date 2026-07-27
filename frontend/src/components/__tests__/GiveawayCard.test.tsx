import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import GiveawayCard from '../GiveawayCard'
import * as AuthContext from '../../context/AuthContext'
import * as favoritesApi from '../../api/favorites'
import type { Giveaway } from '../../types/giveaway'

vi.mock('../../context/AuthContext')
vi.mock('../../api/favorites')
vi.mock('sonner')


const baseGiveaway: Giveaway = {
  id: 1,
  title: 'Free Game',
  image: 'https://example.com/img.jpg',
  worth: '$19.99',
  platforms: 'PC, Steam',
  open_giveaway_url: 'https://example.com',
  end_date: 'N/A',
  description: '',
  instructions: '',
  type: 'game',
  users: 0,
  status: 'Active',
}


function renderCard(props: Partial<{ initialSaved: boolean }> = {}) {
  return render(
    <MemoryRouter>
      <GiveawayCard giveaway={baseGiveaway} {...props} />
    </MemoryRouter>
  )
}


describe('GiveawayCard', () => {
  it('renders title and platform badges', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null, login: vi.fn(), logout: vi.fn(), updateUser: vi.fn(),
    })
    renderCard()
    expect(screen.getByText('Free Game')).toBeInTheDocument()
    expect(screen.getByText('PC')).toBeInTheDocument()
    expect(screen.getByText('Steam')).toBeInTheDocument()
  })

  it('hides save button when user is not logged in', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null, login: vi.fn(), logout: vi.fn(), updateUser: vi.fn(),
    })
    renderCard()
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument()
  })

  it('shows save button when user is logged in', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { user_id: '1', access_token: 'tok', username: 'nick' },
      login: vi.fn(), logout: vi.fn(), updateUser: vi.fn(),
    })
    renderCard()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('calls addFavorite and shows Saved when save button is clicked', async () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: { user_id: '1', access_token: 'tok', username: 'nick' },
      login: vi.fn(), logout: vi.fn(), updateUser: vi.fn(),
    })
    vi.spyOn(favoritesApi, 'addFavorite').mockResolvedValue({
        id: 'fav-1',
        user_id: '1',
        giveaway_id: 1,
        created_at: '2024-01-01',
        })
    renderCard()

    await userEvent.click(screen.getByRole('button', { name: /save/i }))

    expect(favoritesApi.addFavorite).toHaveBeenCalledWith(1)
    expect(await screen.findByRole('button', { name: /saved/i })).toBeInTheDocument()
  })

  it('shows Expired badge when end_date is in the past', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      user: null, login: vi.fn(), logout: vi.fn(), updateUser: vi.fn(),
    })
    const expiredGiveaway = { ...baseGiveaway, end_date: '2020-01-01 00:00:00' }
    render(
      <MemoryRouter>
        <GiveawayCard giveaway={expiredGiveaway} />
      </MemoryRouter>
    )
    expect(screen.getByText('Expired')).toBeInTheDocument()
  })
})