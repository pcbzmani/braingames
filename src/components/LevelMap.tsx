import { useState } from 'react'
import type { Progress } from '@/store/progress'
import { StarRating } from './StarRating'
import { getAllLevels } from '@/levels/generator'

interface Props {
  progress: Progress
  onSelectLevel: (id: number) => void
}

const ZONE_COLORS = {
  easy: 'from-green-900/30 to-cyan-900/30 border-green-500/30',
  medium: 'from-blue-900/30 to-purple-900/30 border-purple-500/30',
  hard: 'from-red-900/30 to-orange-900/30 border-orange-500/30',
}

const GAME_ICONS: Record<string, string> = {
  memory: '🧩', sequence: '🔢', math: '➕', wordscramble: '🔤', pattern: '🎨', logic: '🧠'
}

export function LevelMap({ progress, onSelectLevel }: Props) {
  const [zone, setZone] = useState<'easy' | 'medium' | 'hard'>('easy')
  const allLevels = getAllLevels()

  const zones = { easy: allLevels.slice(0, 150), medium: allLevels.slice(150, 350), hard: allLevels.slice(350, 500) }
  const current = zones[zone]
  const [page, setPage] = useState(0)
  const PER_PAGE = 50
  const paged = current.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  const totalPages = Math.ceil(current.length / PER_PAGE)

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto pb-8">
      {/* Zone selector */}
      <div className="flex gap-2 p-1 bg-brand-card rounded-2xl">
        {(['easy', 'medium', 'hard'] as const).map(z => (
          <button
            key={z}
            onClick={() => { setZone(z); setPage(0) }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
              zone === z ? 'bg-brand-purple text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            {z}
          </button>
        ))}
      </div>
      <div className="text-center text-white/40 text-xs">
        {zone === 'easy' ? 'Levels 1–150' : zone === 'medium' ? 'Levels 151–350' : 'Levels 351–500'}
      </div>
      {/* Grid */}
      <div className={`card-glass bg-gradient-to-br ${ZONE_COLORS[zone]} p-3`}>
        <div className="grid grid-cols-5 gap-2">
          {paged.map(level => {
            const stars = progress.completedLevels[level.id]?.stars ?? 0
            const isLocked = level.id > progress.unlockedLevel
            const isCurrent = level.id === progress.unlockedLevel

            return (
              <button
                key={level.id}
                onClick={() => !isLocked && onSelectLevel(level.id)}
                disabled={isLocked}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center text-xs gap-0.5
                  transition-all active:scale-90 relative
                  ${isLocked
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : isCurrent
                      ? 'bg-brand-purple/40 border-2 border-brand-violet animate-glow'
                      : stars > 0
                        ? 'bg-brand-card border border-brand-green/30 hover:border-brand-green/60'
                        : 'bg-brand-card border border-white/10 hover:border-brand-purple/50'
                  }
                `}
              >
                {isLocked ? (
                  <span className="text-base">🔒</span>
                ) : (
                  <>
                    <span className="text-base">{GAME_ICONS[level.type]}</span>
                    <span className="font-bold text-[10px] text-white/70">{level.id}</span>
                    {stars > 0 && (
                      <div className="flex gap-0.5">
                        {[1,2,3].map(i => (
                          <span key={i} className={`text-[8px] ${i <= stars ? 'text-yellow-400' : 'text-white/20'}`}>★</span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded-lg text-sm transition-all ${
                page === i ? 'bg-brand-purple text-white' : 'bg-white/10 text-white/50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
