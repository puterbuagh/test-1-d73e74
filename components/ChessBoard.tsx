'use client'

import { useState } from 'react'
import { ChessPiece, Position, PieceType, Move } from '@/types/chess'
import Square from './Square'
import MoveHistory from './MoveHistory'
import { getInitialBoard } from '@/lib/chessUtils'
import { getMoveNotation } from '@/lib/moveNotation'

export default function ChessBoard() {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(getInitialBoard())
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [draggedPiece, setDraggedPiece] = useState<{ piece: ChessPiece; from: Position } | null>(null)
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white')

  const makeMove = (from: Position, to: Position) => {
    const piece = board[from.row][from.col]
    if (!piece || piece.color !== currentTurn) return

    const capturedPiece = board[to.row][to.col]
    const newBoard = board.map(r => [...r])
    newBoard[to.row][to.col] = piece
    newBoard[from.row][from.col] = null
    
    const move: Move = {
      piece,
      from,
      to,
      capturedPiece: capturedPiece || undefined,
      notation: getMoveNotation(piece, from, to, capturedPiece || undefined)
    }
    
    setBoard(newBoard)
    setMoveHistory([...moveHistory, move])
    setCurrentTurn(currentTurn === 'white' ? 'black' : 'white')
  }

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      makeMove(selectedSquare, { row, col })
      setSelectedSquare(null)
    } else if (board[row][col] && board[row][col]?.color === currentTurn) {
      setSelectedSquare({ row, col })
    }
  }

  const handleDragStart = (row: number, col: number) => {
    const piece = board[row][col]
    if (piece && piece.color === currentTurn) {
      setDraggedPiece({ piece, from: { row, col } })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (row: number, col: number) => {
    if (draggedPiece) {
      makeMove(draggedPiece.from, { row, col })
      setDraggedPiece(null)
    }
  }

  return (
    <div className="flex gap-8 items-start">
      <div className="inline-block shadow-2xl rounded-lg overflow-hidden border-8 border-amber-900">
        <div className="grid grid-cols-8 gap-0">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0
              const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex
              return (
                <Square
                  key={`${rowIndex}-${colIndex}`}
                  piece={piece}
                  isLight={isLight}
                  isSelected={isSelected}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                  onDragStart={() => handleDragStart(rowIndex, colIndex)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(rowIndex, colIndex)}
                />
              )
            })
          )}
        </div>
      </div>
      <MoveHistory moves={moveHistory} currentTurn={currentTurn} />
    </div>
  )
}