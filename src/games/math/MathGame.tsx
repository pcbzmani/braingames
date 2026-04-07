import { useState, useEffect } from 'react'
import type { MathConfig } from '@/levels/types'
import { generateQuestions } from './engine'
import { useTimer } from '@/hooks/useTimer'
import { TimerBar } from '@/components/TimerBar'

interface Props {
  config: MathConfig
  onComplete: (stars: number, timeMs: number) => void
}

export function MathGame({ config, onComplete }: Props) {
  const questions = generateQuestions(config.operation, config.questionCount, config.maxValue, config.seed)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState<number | null>(null)
  const { elapsed, remaining, isExpired, start, stop } = useTimer(config.timeLimit)

  useEffect(() => { start() }, [start])
  useEffect(() => {
    if (isExpired) { stop(); onComplete(0, (config.timeLimit ?? 60) * 1000) }
  }, [isExpired, stop, onComplete, config.timeLimit])

  function pick(choice: number) {
    if (answered !== null) return
    setAnswered(choice)
    const isCorrect = choice === questions[current].answer
    if (isCorrect) setScore(s => s + 1)

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        stop()
        const finalScore = score + (isCorrect ? 1 : 0)
        const pct = finalScore / questions.length
        const stars = pct === 1 ? (elapsed <= config.starThresholds[1] ? 3 : 2) : pct >= 0.6 ? 1 : 0
        onComplete(stars, elapsed * 1000)
      } else {
        setCurrent(c => c + 1)
        setAnswered(null)
      }
    }, 600)
  }

  const q = questions[current]
  const progress = ((current) / questions.length) * 100

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="flex justify-between w-full text-sm text-white/60">
        <span>{current + 1} / {questions.length}</span>
        {config.timeLimit && remaining !== undefined && (
          <span className={remaining < 15 ? 'text-red-400 font-bold' : ''}>{remaining}s</span>
        )}
        <span>Score: <b className="text-white">{score}</b></span>
      </div>
      {config.timeLimit && remaining !== undefined && (
        <TimerBar remaining={remaining} total={config.timeLimit} />
      )}
      {/* Progress dots */}
      <div className="flex gap-1.5">
        {questions.map((_, i) => (
          <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${
            i < current ? 'bg-brand-green' : i === current ? 'bg-brand-violet' : 'bg-white/20'
          }`} />
        ))}
      </div>
      {/* Question */}
      <div className="card-glass p-8 text-center w-full">
        <div className="font-display text-4xl font-bold text-gradient mb-2">{q.display}</div>
      </div>
      {/* Choices */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {q.choices.map(choice => {
          const isAnswer = choice === q.answer
          const isPicked = choice === answered
          return (
            <button
              key={choice}
              onClick={() => pick(choice)}
              className={`
                card-glass py-5 text-2xl font-bold rounded-xl transition-all duration-200 active:scale-95
                ${answered !== null
                  ? isAnswer
                    ? 'bg-brand-green/20 border-brand-green text-brand-green'
                    : isPicked
                      ? 'bg-brand-red/20 border-brand-red text-brand-red'
                      : 'opacity-40'
                  : 'hover:border-brand-purple/60 hover:bg-brand-purple/10'
                }
              `}
            >
              {choice}
            </button>
          )
        })}
      </div>
    </div>
  )
}
