'use client'

import { ChessPiece } from '@/types/chess'
import { getPieceSymbol } from '@/lib/chessUtils'

interface SquareProps {
  piece: ChessPiece | null
  isLight: boolean
  isSelected: boolean
  onClick: () => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: () => void
}

export default function Square({
  piece,
  isLight,
  isSelected,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
}: SquareProps) {
  return (
    <div
      className={`
        w-20 h-20 flex items-center justify-center cursor-pointer
        transition-all duration-200 relative
        ${isLight ? 'bg-amber-100' : 'bg-amber-700'}
        ${isSelected ? 'ring-4 ring-blue-500 ring-inset' : ''}
        hover:brightness-110
      `}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {piece && (
        <div
          draggable
          onDragStart={onDragStart}
          className="text-6xl select-none cursor-move hover:scale-110 transition-transform"
        >
          {getPieceSymbol(piece)}
        </div>
      )}
    </div>
  )
}