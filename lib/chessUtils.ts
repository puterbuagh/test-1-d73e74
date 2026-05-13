import { ChessPiece, PieceType } from '@/types/chess'

export function getInitialBoard(): (ChessPiece | null)[][] {
  const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null))

  // Black pieces (top)
  const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
  
  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRow[col], color: 'black' }
    board[1][col] = { type: 'pawn', color: 'black' }
  }

  // White pieces (bottom)
  for (let col = 0; col < 8; col++) {
    board[6][col] = { type: 'pawn', color: 'white' }
    board[7][col] = { type: backRow[col], color: 'white' }
  }

  return board
}

export function getPieceSymbol(piece: ChessPiece): string {
  const symbols: Record<PieceType, { white: string; black: string }> = {
    king: { white: '♔', black: '♚' },
    queen: { white: '♕', black: '♛' },
    rook: { white: '♖', black: '♜' },
    bishop: { white: '♗', black: '♝' },
    knight: { white: '♘', black: '♞' },
    pawn: { white: '♙', black: '♟' },
  }

  return symbols[piece.type][piece.color]
}