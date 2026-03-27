import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
      <p className="text-8xl font-bold text-primary">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground text-sm">
          The page you're looking for doesn't exist.
        </p>
      </div>
      <Button onClick={() => navigate('/')}>
        <Home className="w-4 h-4 mr-2" /> Back to giveaways
      </Button>
    </div>
  )
}

export default NotFoundPage