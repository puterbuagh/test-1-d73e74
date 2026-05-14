'use client'

import { useState } from 'react'
import { ChessPiece, Position, Move, PieceColor, TimeControl, TIME_CONTROLS } from '@/types/chess'
import Square from './Square'
import MoveHistory from './MoveHistory'
import ChessClock from './ChessClock'
import ClockSettings from './ClockSettings'
import { getInitialBoard, getPieceSymbol } from '@/lib/chessUtils'
import { getLegalMoves, isInCheck, hasAnyLegalMove } from '@/lib/chessRules'
import { getMoveNotation } from '@/lib/moveNotation'

export default function ChessBoard() {
  const defaultTc = TIME_CONTROLS[4]
  const [board, setBoard] = useState<(ChessPiece | null)[][]>(getInitialBoard())
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [draggedPiece, setDraggedPiece] = useState<{ piece: ChessPiece; from: Position } | null>(null)
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('white')
  const [legalTargets, setLegalTargets] = useState<Position[]>([])
  const [timeControl, setTimeControl] = useState<TimeControl>(defaultTc)
  const [whiteTime, setWhiteTime] = useState(defaultTc.initialMinutes * 60 * 1000)
  const [blackTime, setBlackTime] = useState(defaultTc.initialMinutes * 60 * 1000)
  const [running, setRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [status, setStatus] = useState('White to move')

  const newGame = () => {
    setBoard(getInitialBoard())
    setSelectedSquare(null)
    setLegalTargets([])
    setMoveHistory([])
    setCurrentTurn('white')
    setWhiteTime(timeControl.initialMinutes * 60 * 1000)
    setBlackTime(timeControl.initialMinutes * 60 * 1000)
    setRunning(false)
    setGameOver(false)
    setStatus('White to move')
  }

  const changeTimeControl = (tc: TimeControl) => {
    setTimeControl(tc)
    setWhiteTime(tc.initialMinutes * 60 * 1000)
    setBlackTime(tc.initialMinutes * 60 * 1000)
    setBoard(getInitialBoard())
    setMoveHistory([])
    setCurrentTurn('white')
    setSelectedSquare(null)
    setLegalTargets([])
    setRunning(false)
    setGameOver(false)
    setStatus('White to move')
  }

  const resign = () => {
    if (gameOver) return
    setGameOver(true)
    setRunning(false)
    setStatus(`${currentTurn === 'white' ? 'Black' : 'White'} wins by resignation`)
  }

  const handleTick = (color: PieceColor, newTimeMs: number) => {
    if (color === 'white') setWhiteTime(newTimeMs)
    else setBlackTime(newTimeMs)
  }

  const handleTimeout = (color: PieceColor) => {
    setGameOver(true)
    setRunning(false)
    setStatus(`${color === 'white' ? 'Black' : 'White'} wins on time`)
  }

  const makeMove = (from: Position, to: Position) => {
    if (gameOver) return
    const piece = board[from.row][from.col]
    if (!piece || piece.color !== currentTurn) return

    const lastMove = moveHistory[moveHistory.length - 1]
    const legal = getLegalMoves(board, from, lastMove)
    if (!legal.some(m => m.row === to.row && m.col === to.col)) return

    const capturedPiece = board[to.row][to.col]
    const newBoard = board.map(r => [...r])
    let movedPiece: ChessPiece = { ...piece, hasMoved: true }

    if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
      movedPiece = { type: 'queen', color: piece.color, hasMoved: true }
    }

    let isCastle: 'kingside' | 'queenside' | undefined
    if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
      if (to.col > from.col) {
        isCastle = 'kingside'
        const rook = newBoard[from.row][7]
        newBoard[from.row][7] = null
        newBoard[from.row][5] = rook ? { ...rook, hasMoved: true } : null
      } else {
        isCastle = 'queenside'
        const rook = newBoard[from.row][0]
        newBoard[from.row][0] = null
        newBoard[from.row][3] = rook ? { ...rook, hasMoved: true } : null
      }
    }

    let isEnPassant = false
    let epCaptured: ChessPiece | undefined
    if (piece.type === 'pawn' && from.col !== to.col && !capturedPiece) {
      isEnPassant = true
      const capturedRow = from.row
      epCaptured = newBoard[capturedRow][to.col] || undefined
      newBoard[capturedRow][to.col] = null
    }

    newBoard[to.row][to.col] = movedPiece
    newBoard[from.row][from.col] = null

    const finalCaptured = capturedPiece || epCaptured
    const move: Move = {
      piece,
      from,
      to,
      capturedPiece: finalCaptured || undefined,
      notation: getMoveNotation(piece, from, to, finalCaptured || undefined),
      isCastle,
      isEnPassant,
    }

    const nextTurn: PieceColor = currentTurn === 'white' ? 'black' : 'white'
    setBoard(newBoard)
    setMoveHistory([...moveHistory, move])

    if (currentTurn === 'white') {
      setWhiteTime(t => t + timeControl.incrementSeconds * 1000)
    } else {
      setBlackTime(t => t + timeControl.incrementSeconds * 1000)
    }

    setCurrentTurn(nextTurn)
    if (!running) setRunning(true)

    const inCheck = isInCheck(newBoard, nextTurn)
    const hasMove = hasAnyLegalMove(newBoard, nextTurn, move)
    if (!hasMove && inCheck) {
      setGameOver(true)
      setRunning(false)
      setStatus(`Checkmate! ${currentTurn === 'white' ? 'White' : 'Black'} wins`)
    } else if (!hasMove && !inCheck) {
      setGameOver(true)
      setRunning(false)
      setStatus('Stalemate - Draw')
    } else if (inCheck) {
      setStatus(`${nextTurn === 'white' ? 'White' : 'Black'} is in check`)
    } else {
      setStatus(`${nextTurn === 'white' ? 'White' : 'Black'} to move`)
    }
  }

  const handleSquareClick = (row: number, col: number) => {
    if (gameOver) return
    const lastMove = moveHistory[moveHistory.length - 1]
    if (selectedSquare) {
      const isLegal = legalTargets.some(m => m.row === row && m.col === col)
      if (isLegal) {
        makeMove(selectedSquare, { row, col })
        setSelectedSquare(null)
        setLegalTargets([])
      } else if (board[row][col] && board[row][col]?.color === currentTurn) {
        setSelectedSquare({ row, col })
        setLegalTargets(getLegalMoves(board, { row, col }, lastMove))
      } else {
        setSelectedSquare(null)
        setLegalTargets([])
      }
    } else if (board[row][col] && board[row][col]?.color === currentTurn) {
      setSelectedSquare({ row, col })
      setLegalTargets(getLegalMoves(board, { row, col }, lastMove))
    }
  }

  const handleDragStart = (row: number, col: number) => {
    if (gameOver) return
    const piece = board[row][col]
    if (piece && piece.color === currentTurn) {
      const lastMove = moveHistory[moveHistory.length - 1]
      setDraggedPiece({ piece, from: { row, col } })
      setLegalTargets(getLegalMoves(board, { row, col }, lastMove))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (row: number, col: number) => {
    if (draggedPiece) {
      makeMove(draggedPiece.from, { row, col })
      setDraggedPiece(null)
      setLegalTargets([])
    }
  }

  return (
    <div className="flex gap-6 items-start flex-wrap justify-center">
      <div className="flex flex-col gap-4">
        <ClockSettings
          currentControl={timeControl}
          onSelect={changeTimeControl}
          disabled={running && !gameOver}
        />
        <ChessClock
          whiteTimeMs={whiteTime}
          blackTimeMs={blackTime}
          activeColor={currentTurn}
          isRunning={running}
          gameOver={gameOver}
          onTick={handleTick}
          onTimeout={handleTimeout}
        />
        <div className="bg-slate-800 rounded-lg border-4 border-amber-900 p-4 w-64">
          <div className="text-xs text-slate-400 mb-1">Status</div>
          <div className="text-white font-semibold mb-3">{status}</div>
          <div className="flex gap-2">
            <button
              onClick={newGame}
              className="flex-1 bg-amber-700 hover:bg-amber-600 text-white font-semibold py-2 px-3 rounded text-sm"
            >
              New Game
            </button>
            <button
              onClick={resign}
              disabled={gameOver}
              className="flex-1 bg-red-700 hover:bg-red-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 rounded text-sm"
            >
              Resign
            </button>
          </div>
        </div>
      </div>
      <div className="inline-block shadow-2xl rounded-lg overflow-hidden border-8 border-amber-900">
        <div className="grid grid-cols-8 gap-0">
          {board.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isLight = (rowIndex + colIndex) % 2 === 0
              const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex
              const isTarget = legalTargets.some(m => m.row === rowIndex && m.col === colIndex)
              return (
                <Square
                  key={`${rowIndex}-${colIndex}`}
                  piece={piece}
                  isLight={isLight}
                  isSelected={isSelected}
                  isTarget={isTarget}
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
