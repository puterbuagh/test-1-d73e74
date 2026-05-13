import { ChessPiece, Position } from '@/types/chess'

// Convert row/col to chess notation (e.g., 0,0 -> a8, 7,7 -> h1)
function positionToNotation(pos: Position): string {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1']
  return files[pos.col] + ranks[pos.row]
}

// Get piece letter for notation (K, Q, R, B, N, or empty for pawn)
function getPieceLetter(piece: ChessPiece): string {
  const letters: Record<string, string> = {
    king: 'K',
    queen: 'Q',
    rook: 'R',
    bishop: 'B',
    knight: 'N',
    pawn: ''
  }
  return letters[piece.type]
}

export function getMoveNotation(
  piece: ChessPiece,
  from: Position,
  to: Position,
  capturedPiece?: ChessPiece
): string {
  const pieceLetter = getPieceLetter(piece)
  const toSquare = positionToNotation(to)
  const isCapture = !!capturedPiece
  
  if (piece.type === 'pawn') {
    // Pawn moves: e4 or exd5 (for captures)
    if (isCapture) {
      const fromFile = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][from.col]
      return `${fromFile}x${toSquare}`
    }
    return toSquare
  }
  
  // Piece moves: Nf3 or Nxf3 (for captures)
  const captureSymbol = isCapture ? 'x' : ''
  return `${pieceLetter}${captureSymbol}${toSquare}`
}