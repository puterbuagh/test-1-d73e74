export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'
export type PieceColor = 'white' | 'black'

export interface ChessPiece {
  type: PieceType
  color: PieceColor
  hasMoved?: boolean
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
  isCheck?: boolean
  isCheckmate?: boolean
  isCastle?: 'kingside' | 'queenside'
  isEnPassant?: boolean
  promotion?: PieceType
}

export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw' | 'timeout' | 'resigned'

export interface TimeControl {
  name: string
  initialMinutes: number
  incrementSeconds: number
}

export interface ClockState {
  whiteTimeMs: number
  blackTimeMs: number
  isRunning: boolean
  activeColor: PieceColor
}

export const TIME_CONTROLS: TimeControl[] = [
  { name: 'Bullet 1+0', initialMinutes: 1, incrementSeconds: 0 },
  { name: 'Bullet 2+1', initialMinutes: 2, incrementSeconds: 1 },
  { name: 'Blitz 3+0', initialMinutes: 3, incrementSeconds: 0 },
  { name: 'Blitz 3+2', initialMinutes: 3, incrementSeconds: 2 },
  { name: 'Blitz 5+0', initialMinutes: 5, incrementSeconds: 0 },
  { name: 'Blitz 5+3', initialMinutes: 5, incrementSeconds: 3 },
  { name: 'Rapid 10+0', initialMinutes: 10, incrementSeconds: 0 },
  { name: 'Rapid 15+10', initialMinutes: 15, incrementSeconds: 10 },
  { name: 'Classical 30+0', initialMinutes: 30, incrementSeconds: 0 },
  { name: 'Classical 60+30', initialMinutes: 60, incrementSeconds: 30 },
]
