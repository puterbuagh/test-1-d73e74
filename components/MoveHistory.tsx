'use client'

import { Move } from '@/types/chess'

interface MoveHistoryProps {
  moves: Move[]
  currentTurn: 'white' | 'black'
}

export default function MoveHistory({ moves, currentTurn }: MoveHistoryProps) {
  // Group moves into pairs (white, black)
  const movePairs: { white?: Move; black?: Move; moveNumber: number }[] = []
  
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      white: moves[i],
      black: moves[i + 1],
      moveNumber: Math.floor(i / 2) + 1
    })
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-2xl border-4 border-amber-900 p-6 w-80">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Move History</h2>
        <div className="text-sm font-semibold px-3 py-1 rounded-full bg-amber-700 text-white">
          {currentTurn === 'white' ? '⚪ White' : '⚫ Black'}
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-lg p-4 h-[600px] overflow-y-auto">
        {moves.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No moves yet</p>
        ) : (
          <div className="space-y-2">
            {movePairs.map((pair, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-2 rounded hover:bg-slate-800 transition-colors"
              >
                <span className="text-amber-500 font-bold w-8">{pair.moveNumber}.</span>
                <div className="flex-1 flex gap-4">
                  <span className="text-white font-mono flex-1">
                    {pair.white?.notation || ''}
                  </span>
                  {pair.black && (
                    <span className="text-slate-300 font-mono flex-1">
                      {pair.black.notation}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-slate-400 text-center">
        {moves.length} move{moves.length !== 1 ? 's' : ''} played
      </div>
    </div>
  )
}