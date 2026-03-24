import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}


function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search giveaways..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
      />
    </div>
  )
}

export default SearchBar