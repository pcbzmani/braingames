import { useEffect, useState } from 'react'
import { playLevelComplete, playMilestone } from '@/utils/sounds'

interface Props {
  stars: number
  levelId: number
  timeMs: number
  onNext: () => void
  onRetry: () => void
  onHome: () => void
  isLastLevel?: boolean
}

function getMilestone(levelId: number): string | null {
  if (levelId === 10)  return '🎉 First 10 levels done!'
  if (levelId === 50)  return '🔥 50 levels crushed!'
  if (levelId === 100) return '💯 Century! 100 levels!'
  if (levelId === 150) return '🌟 Easy Zone Complete!'
  if (levelId === 200) return '🚀 200 levels — unstoppable!'
  if (levelId === 350) return '🧠 Medium Zone Complete!'
  if (levelId === 400) return '👑 400 levels — legend!'
  if (levelId === 500) return '🏆 ALL 500 LEVELS! Champion!'
  if (levelId % 50 === 0) return `🎯 Level ${levelId} milestone!`
  return null
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  return `${Math.floor(s / 60)}m ${s % 60}s`
}

const STAR_MESSAGES = [
  'Keep going! You got this 💪',
  'Not bad! You earned a star ⭐',
  'Well done! Great effort 👏',
  'Perfect! Blazing fast! ⚡',
]

const RATING_LABELS = [
  { label: 'Try Again', color: 'text-white/40' },
  { label: 'Good', color: 'text-green-400' },
  { label: 'Great', color: 'text-cyan-400' },
  { label: 'Perfect', color: 'text-yellow-400' },
]

export function GameResult({ stars, levelId, timeMs, onNext, onRetry, onHome, isLastLevel }: Props) {
  const [visibleStars, setVisibleStars] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const milestone = getMilestone(levelId)
  const isMilestone = milestone !== null && stars > 0

  useEffect(() => {
    // Play sound immediately
    playLevelComplete(stars)
    if (isMilestone) setTimeout(() => playMilestone(), 700)

    // Animate stars in one by one
    let i = 0
    const interval = setInterval(() => {
      i++
      setVisibleStars(i)
      if (i >= stars) {
        clearInterval(interval)
        setTimeout(() => setShowContent(true), 200)
      }
    }, 220)
    if (stars === 0) {
      setVisibleStars(0)
      setShowContent(true)
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const emoji = stars === 0 ? '😤' : stars === 1 ? '😊' : stars === 2 ? '🎉' : '🏆'

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
         style={{ backdropFilter: 'blur(8px)' }}>
      {/* Confetti particles for 3 stars */}
      {stars === 3 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-float"
              style={{
                left: `${5 + i * 4.5}%`,
                top: `${Math.random() * 40}%`,
                background: ['#6C3CE1','#00E5FF','#FFD700','#00E676','#FF5252'][i % 5],
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="card-glass p-7 max-w-sm w-full text-center animate-pop relative">
        {/* Level badge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-purple px-3 py-1 rounded-full text-xs font-bold font-display">
          LEVEL {levelId}
        </div>

        {/* Emoji */}
        <div className="text-6xl mb-3 mt-2">{emoji}</div>

        {/* Message */}
        <h2 className="font-display text-xl font-bold text-gradient mb-1">
          {STAR_MESSAGES[stars]}
        </h2>

        {/* Rating label */}
        <p className={`text-sm font-bold mb-4 ${RATING_LABELS[stars].color}`}>
          {RATING_LABELS[stars].label}
        </p>

        {/* Stars — animate in */}
        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3].map(i => (
            <span
              key={i}
              className={`text-4xl transition-all duration-200 ${
                i <= visibleStars
                  ? 'star-filled scale-110'
                  : 'star-empty'
              }`}
              style={{ transform: i <= visibleStars ? 'scale(1.15)' : 'scale(0.9)' }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Time */}
        {timeMs > 0 && (
          <p className="text-white/40 text-xs mb-4">
            Time: <span className="text-white/70 font-semibold">{formatTime(timeMs)}</span>
          </p>
        )}

        {/* Milestone banner */}
        {isMilestone && showContent && (
          <div className="bg-brand-gold/10 border border-brand-gold/40 rounded-xl px-4 py-2 mb-4 animate-pop">
            <p className="text-brand-gold text-sm font-bold">{milestone}</p>
          </div>
        )}

        {/* Buttons */}
        {showContent && (
          <div className="flex flex-col gap-2.5 mt-4">
            {stars > 0 && !isLastLevel && (
              <button className="btn-primary py-3.5" onClick={onNext}>
                Next Level →
              </button>
            )}
            {isLastLevel && stars > 0 && (
              <div className="text-brand-gold font-bold text-sm">🎊 You've conquered all 500 levels!</div>
            )}
            <div className="flex gap-2">
              <button className="btn-ghost flex-1 py-2.5 text-sm" onClick={onRetry}>↺ Retry</button>
              <button className="btn-ghost flex-1 py-2.5 text-sm" onClick={onHome}>🗺 Map</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
