import { StarRating } from './StarRating'

interface Props {
  stars: number
  levelId: number
  onNext: () => void
  onRetry: () => void
  onHome: () => void
  isLastLevel?: boolean
}

const MESSAGES = [
  ['Keep trying! 💪', 'Not bad! 🙂', 'Well done! 👏', 'Excellent! 🌟'],
]

export function GameResult({ stars, levelId, onNext, onRetry, onHome, isLastLevel }: Props) {
  const msg = stars === 0 ? 'Keep trying! 💪' : stars === 1 ? 'Not bad! 🙂' : stars === 2 ? 'Well done! 👏' : 'Perfect! 🌟'

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="card-glass p-8 max-w-sm w-full text-center animate-pop">
        <div className="text-6xl mb-4">{stars === 0 ? '😤' : stars === 3 ? '🏆' : '😊'}</div>
        <h2 className="font-display text-2xl font-bold text-gradient mb-2">{msg}</h2>
        <p className="text-white/60 mb-6">Level {levelId}</p>
        <div className="flex justify-center mb-8">
          <StarRating stars={stars} size="lg" />
        </div>
        <div className="flex flex-col gap-3">
          {stars > 0 && !isLastLevel && (
            <button className="btn-primary" onClick={onNext}>Next Level →</button>
          )}
          <button className="btn-ghost" onClick={onRetry}>Retry</button>
          <button className="btn-ghost" onClick={onHome}>Level Map</button>
        </div>
      </div>
    </div>
  )
}
