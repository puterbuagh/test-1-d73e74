export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'
export type PieceColor = 'white' | 'black'

export interface ChessPiece {
  type: PieceType
  color: PieceColor
}

export interface Position {
  row: number
  col: number
}

export interface Move {
  piece: ChessPiece
  from: Position
  to: Position
  capturedPiece?: ChessPiece
  notation: string
}