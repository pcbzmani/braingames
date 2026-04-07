interface Props {
  stars: number   // 0-3
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASS = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl' }

export function StarRating({ stars, size = 'md' }: Props) {
  return (
    <div className={`flex gap-1 ${SIZE_CLASS[size]}`}>
      {[1, 2, 3].map(i => (
        <span key={i} className={i <= stars ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </div>
  )
}
