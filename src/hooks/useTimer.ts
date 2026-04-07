import { useState, useEffect, useRef, useCallback } from 'react'

export function useTimer(limitSeconds?: number) {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const startRef = useRef<number>(0)
  const rafRef = useRef<number>(0)

  const tick = useCallback(() => {
    const now = Date.now()
    const newElapsed = Math.floor((now - startRef.current) / 1000)
    setElapsed(newElapsed)
    rafRef.current = window.setTimeout(tick, 200)
  }, [])

  const start = useCallback(() => {
    startRef.current = Date.now()
    setElapsed(0)
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    setRunning(false)
    clearTimeout(rafRef.current)
  }, [])

  useEffect(() => {
    if (running) {
      rafRef.current = window.setTimeout(tick, 200)
    } else {
      clearTimeout(rafRef.current)
    }
    return () => clearTimeout(rafRef.current)
  }, [running, tick])

  const remaining = limitSeconds !== undefined ? Math.max(0, limitSeconds - elapsed) : undefined
  const isExpired = remaining !== undefined && remaining === 0

  return { elapsed, remaining, isExpired, start, stop, running }
}
