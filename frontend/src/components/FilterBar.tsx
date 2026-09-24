import { useState, useEffect, useRef } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import type { GiveawayFilters } from '../api/giveaways'

interface FilterBarProps {
  filters: GiveawayFilters
  onChange: (filters: GiveawayFilters) => void
}

interface Option {
  value: string
  label: string
}


const QUICK_PLATFORMS: Option[] = [
  { value: 'steam', label: 'Steam' },
  { value: 'epic-games-store', label: 'Epic Games' },
  { value: 'gog', label: 'GOG' },
  { value: 'pc', label: 'PC' },
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS' },
]

const MORE_PLATFORMS: Option[] = [
  { value: 'switch', label: 'Switch' },
  { value: 'ps4', label: 'PS4' },
  { value: 'ps5', label: 'PS5' },
  { value: 'xbox-one', label: 'Xbox One' },
  { value: 'xbox-series-xs', label: 'Xbox Series X/S' },
  { value: 'vr', label: 'VR' },
]

const TYPES: Option[] = [
  { value: 'game', label: 'Game' },
  { value: 'loot', label: 'Loot' },
  { value: 'beta', label: 'Beta' },
]

const SORT_OPTIONS: Option[] = [
  { value: 'date', label: 'Date' },
  { value: 'value', label: 'Value' },
  { value: 'popularity', label: 'Popularity' },
]

const CHIP_CLASS =
  'px-3 py-1 rounded-full text-sm border border-border transition-colors cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-card data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground'


function findLabel(options: Option[], value: string | undefined): string | undefined {
  return options.find(o => o.value === value)?.label ?? value
}


function FilterBar({ filters, onChange }: FilterBarProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  const toggle = (key: 'platform' | 'type' | 'sort_by', value: string) => {
    onChange({ ...filters, [key]: filters[key] === value ? undefined : value })
  }

  const remove = (key: keyof GiveawayFilters) => {
    onChange({ ...filters, [key]: undefined })
  }

  const renderChip = (key: 'platform' | 'type' | 'sort_by', option: Option) => (
    <button
      key={option.value}
      type="button"
      data-state={filters[key] === option.value ? 'active' : 'inactive'}
      className={CHIP_CLASS}
      onClick={() => toggle(key, option.value)}
    >
      {option.label}
    </button>
  )

  const activeFilters: { key: keyof GiveawayFilters; label: string }[] = []
  if (filters.platform) {
    activeFilters.push({
      key: 'platform',
      label: findLabel([...QUICK_PLATFORMS, ...MORE_PLATFORMS], filters.platform) ?? filters.platform,
    })
  }
  if (filters.type) {
    activeFilters.push({ key: 'type', label: findLabel(TYPES, filters.type) ?? filters.type })
  }
  if (filters.sort_by) {
    activeFilters.push({ key: 'sort_by', label: `Sort: ${findLabel(SORT_OPTIONS, filters.sort_by)}` })
  }
  if (filters.min_worth && filters.min_worth > 0) {
    activeFilters.push({ key: 'min_worth', label: `Min $${filters.min_worth}` })
  }
  if (filters.only_active) {
    activeFilters.push({ key: 'only_active', label: 'Only active' })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {QUICK_PLATFORMS.map(option => renderChip('platform', option))}
        <span className="w-px h-6 bg-border mx-1" aria-hidden="true" />
        {TYPES.map(option => renderChip('type', option))}

        <div ref={dropdownRef} className="relative ml-auto">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm border border-border bg-card text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-lg p-4 flex flex-col gap-4 z-50">
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">More platforms</p>
                <div className="flex flex-wrap gap-2">
                  {MORE_PLATFORMS.map(option => renderChip('platform', option))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sort by</p>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map(option => renderChip('sort_by', option))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="filter-min-worth" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Min worth ($)
                </label>
                <input
                  id="filter-min-worth"
                  type="number"
                  min={0}
                  step={1}
                  value={filters.min_worth ?? ''}
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : Number(e.target.value)
                    onChange({ ...filters, min_worth: value })
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.only_active ?? false}
                  onChange={(e) => onChange({ ...filters, only_active: e.target.checked || undefined })}
                  className="w-4 h-4 accent-primary"
                />
                Only active
              </label>
            </div>
          )}
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map(({ key, label }) => (
            <span
              key={key}
              className="flex items-center gap-1 pl-3 pr-1 py-1 rounded-full text-sm bg-primary/10 text-foreground border border-border"
            >
              {label}
              <button
                type="button"
                aria-label={`Remove ${label} filter`}
                onClick={() => remove(key)}
                className="p-0.5 rounded-full hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => onChange({})}
            className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}

export default FilterBar
