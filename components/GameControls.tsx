'use client'

import { TimeControl, TIME_CONTROLS } from '@/types/chess'

export type { TimeControl }
export { TIME_CONTROLS }

interface GameControlsProps {
  currentTurn: 'white' | 'black'
  status: string
  gameOver: boolean
  timeControl: TimeControl
  onChangeTimeControl: (tc: TimeControl) => void
  onNewGame: () => void
  onResign: () => void
  whiteTime: number
  blackTime: number
  running: boolean
}

function formatTime(ms: number): string {
  if (ms < 0) ms = 0
  const totalSec = Math.ceil(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function GameControls({
  currentTurn,
  status,
  gameOver,
  timeControl,
  onChangeTimeControl,
  onNewGame,
  onResign,
  whiteTime,
  blackTime,
  running,
}: GameControlsProps) {
  return (
    <div className="bg-slate-800 rounded-lg shadow-2xl border-4 border-amber-900 p-6 w-80">
      <h2 className="text-2xl font-bold text-white mb-4">Game</h2>

      <div className="space-y-3 mb-4">
        <div className={`flex items-center justify-between p-3 rounded-lg ${currentTurn === 'black' && running && !gameOver ? 'bg-amber-700' : 'bg-slate-900'}`}>
          <span className="text-white font-semibold">⚫ Black</span>
          <span className="text-white font-mono text-2xl">{formatTime(blackTime)}</span>
        </div>
        <div className={`flex items-center justify-between p-3 rounded-lg ${currentTurn === 'white' && running && !gameOver ? 'bg-amber-700' : 'bg-slate-900'}`}>
          <span className="text-white font-semibold">⚪ White</span>
          <span className="text-white font-mono text-2xl">{formatTime(whiteTime)}</span>
        </div>
      </div>

      <div className="mb-4 p-3 bg-slate-900 rounded-lg min-h-[60px]">
        <div className="text-xs text-slate-400 mb-1">Status</div>
        <div className="text-white font-semibold">{status}</div>
      </div>

      <div className="mb-4">
        <label className="text-sm text-slate-300 block mb-2">Time Control</label>
        <select
          value={timeControl.name}
          onChange={(e) => {
            const tc = TIME_CONTROLS.find(t => t.name === e.target.value)
            if (tc) onChangeTimeControl(tc)
          }}
          className="w-full bg-slate-900 text-white p-2 rounded border border-slate-700"
        >
          {TIME_CONTROLS.map(tc => (
            <option key={tc.name} value={tc.name}>{tc.name}</option>
          ))}
        </select>
        <div className="text-xs text-slate-400 mt-1">
          {timeControl.initialMinutes} min + {timeControl.incrementSeconds}s increment
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onNewGame}
          className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          New Game
        </button>
        <button
          onClick={onResign}
          disabled={gameOver}
          className="flex-1 bg-red-700 hover:bg-red-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Resign
        </button>
      </div>
    </div>
  )
}
