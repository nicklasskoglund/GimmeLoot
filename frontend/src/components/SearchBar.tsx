interface SearchBarProps {
    value: string
    onChange: (value: string) => void
}


function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <input
        type='text'
        placeholder='Search giveaways...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        />
    )
}

export default SearchBar