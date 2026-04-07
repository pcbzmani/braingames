interface Props {
  remaining: number
  total: number
}

export function TimerBar({ remaining, total }: Props) {
  const pct = (remaining / total) * 100
  const color = pct > 50 ? 'bg-brand-green' : pct > 25 ? 'bg-yellow-400' : 'bg-brand-red'

  return (
    <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
