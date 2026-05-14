'use client'

import { useEffect, useRef } from 'react'
import { PieceColor } from '@/types/chess'

interface ChessClockProps {
  whiteTimeMs: number
  blackTimeMs: number
  activeColor: PieceColor
  isRunning: boolean
  gameOver: boolean
  onTick: (color: PieceColor, newTimeMs: number) => void
  onTimeout: (color: PieceColor) => void
}

function formatTime(ms: number): string {
  if (ms <= 0) return '0:00.0'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (ms < 10000) {
    const tenths = Math.floor((ms % 1000) / 100)
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function ChessClock({
  whiteTimeMs,
  blackTimeMs,
  activeColor,
  isRunning,
  gameOver,
  onTick,
  onTimeout,
}: ChessClockProps) {
  const lastTickRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!isRunning || gameOver) return
    lastTickRef.current = Date.now()
    const interval = setInterval(() => {
      const now = Date.now()
      const delta = now - lastTickRef.current
      lastTickRef.current = now
      const current = activeColor === 'white' ? whiteTimeMs : blackTimeMs
      const next = current - delta
      if (next <= 0) {
        onTick(activeColor, 0)
        onTimeout(activeColor)
      } else {
        onTick(activeColor, next)
      }
    }, 100)
    return () => clearInterval(interval)
  }, [isRunning, activeColor, gameOver, whiteTimeMs, blackTimeMs, onTick, onTimeout])

  const renderClock = (color: PieceColor, timeMs: number) => {
    const isActive = activeColor === color && isRunning && !gameOver
    const isLow = timeMs < 30000
    return (
      <div
        className={`
          rounded-lg p-4 border-4 transition-all
          ${isActive ? 'border-amber-500 bg-slate-700 scale-105' : 'border-slate-700 bg-slate-800'}
          ${isLow && isActive ? 'animate-pulse border-red-500' : ''}
        `}
      >
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
          {color === 'white' ? '⚪ White' : '⚫ Black'}
        </div>
        <div className={`text-4xl font-mono font-bold ${isLow ? 'text-red-400' : 'text-white'}`}>
          {formatTime(timeMs)}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 w-64">
      {renderClock('black', blackTimeMs)}
      {renderClock('white', whiteTimeMs)}
    </div>
  )
}
