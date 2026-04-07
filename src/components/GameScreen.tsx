import { useState } from 'react'
import type { AnyLevelConfig } from '@/levels/types'
import { MemoryGame } from '@/games/memory/MemoryGame'
import { SequenceGame } from '@/games/sequence/SequenceGame'
import { MathGame } from '@/games/math/MathGame'
import { WordScrambleGame } from '@/games/wordscramble/WordScrambleGame'
import { PatternGame } from '@/games/pattern/PatternGame'
import { LogicGame } from '@/games/logic/LogicGame'
import { GameResult } from './GameResult'

interface Props {
  config: AnyLevelConfig
  onFinish: (stars: number, timeMs: number) => void
  onBack: () => void
  onNext: () => void
  isLastLevel: boolean
}

const GAME_LABELS: Record<string, string> = {
  memory: '🧩 Memory Match', sequence: '🔢 Sequence', math: '➕ Math', wordscramble: '🔤 Word Scramble',
  pattern: '🎨 Pattern', logic: '🧠 Logic',
}

export function GameScreen({ config, onFinish, onBack, onNext, isLastLevel }: Props) {
  const [result, setResult] = useState<{ stars: number; timeMs: number } | null>(null)
  const [key, setKey] = useState(0)  // remount game to retry

  function handleComplete(stars: number, timeMs: number) {
    onFinish(stars, timeMs)
    setResult({ stars, timeMs })
  }

  function retry() {
    setResult(null)
    setKey(k => k + 1)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <button onClick={onBack} className="text-white/60 hover:text-white text-xl w-8">←</button>
        <div className="flex-1 text-center">
          <p className="font-display font-bold text-gradient text-sm">{GAME_LABELS[config.type]}</p>
          <p className="text-white/40 text-xs">Level {config.id} · {config.difficulty}</p>
        </div>
        <div className="w-8" />
      </div>
      {/* Game content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center">
        <div key={key}>
          {config.type === 'memory' && <MemoryGame config={config} onComplete={handleComplete} />}
          {config.type === 'sequence' && <SequenceGame config={config} onComplete={handleComplete} />}
          {config.type === 'math' && <MathGame config={config} onComplete={handleComplete} />}
          {config.type === 'wordscramble' && <WordScrambleGame config={config} onComplete={handleComplete} />}
          {config.type === 'pattern' && <PatternGame config={config} onComplete={handleComplete} />}
          {config.type === 'logic' && <LogicGame config={config} onComplete={handleComplete} />}
        </div>
      </div>
      {/* Result overlay */}
      {result && (
        <GameResult
          stars={result.stars}
          levelId={config.id}
          onNext={onNext}
          onRetry={retry}
          onHome={onBack}
          isLastLevel={isLastLevel}
        />
      )}
    </div>
  )
}
