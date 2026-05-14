'use client'

import { useState } from 'react'
import { TimeControl, TIME_CONTROLS } from '@/types/chess'

interface ClockSettingsProps {
  currentControl: TimeControl
  onSelect: (tc: TimeControl) => void
  disabled?: boolean
}

export default function ClockSettings({ currentControl, onSelect, disabled }: ClockSettingsProps) {
  const [customMins, setCustomMins] = useState(5)
  const [customInc, setCustomInc] = useState(0)
  const [showCustom, setShowCustom] = useState(false)

  const applyCustom = () => {
    onSelect({
      name: `Custom ${customMins}+${customInc}`,
      initialMinutes: customMins,
      incrementSeconds: customInc,
    })
  }

  return (
    <div className="bg-slate-800 rounded-lg border-4 border-amber-900 p-4 w-64">
      <h3 className="text-lg font-bold text-white mb-3">Time Control</h3>
      <div className="text-xs text-amber-400 mb-2">Current: {currentControl.name}</div>
      <div className="grid grid-cols-2 gap-1 max-h-64 overflow-y-auto">
        {TIME_CONTROLS.map((tc) => (
          <button
            key={tc.name}
            onClick={() => onSelect(tc)}
            disabled={disabled}
            className={`
              text-xs px-2 py-2 rounded transition-colors
              ${currentControl.name === tc.name
                ? 'bg-amber-600 text-white'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {tc.name}
          </button>
        ))}
      </div>
      <button
        onClick={() => setShowCustom(!showCustom)}
        disabled={disabled}
        className="mt-3 w-full text-xs px-2 py-2 rounded bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50"
      >
        {showCustom ? 'Hide Custom' : 'Custom Time'}
      </button>
      {showCustom && (
        <div className="mt-3 space-y-2">
          <div>
            <label className="text-xs text-slate-400">Minutes</label>
            <input
              type="number"
              min={1}
              max={180}
              value={customMins}
              onChange={(e) => setCustomMins(Number(e.target.value))}
              disabled={disabled}
              className="w-full px-2 py-1 rounded bg-slate-900 text-white text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Increment (sec)</label>
            <input
              type="number"
              min={0}
              max={60}
              value={customInc}
              onChange={(e) => setCustomInc(Number(e.target.value))}
              disabled={disabled}
              className="w-full px-2 py-1 rounded bg-slate-900 text-white text-sm"
            />
          </div>
          <button
            onClick={applyCustom}
            disabled={disabled}
            className="w-full px-2 py-2 rounded bg-amber-600 text-white text-sm hover:bg-amber-700 disabled:opacity-50"
          >
            Apply Custom
          </button>
        </div>
      )}
    </div>
  )
}
