import { ChessPiece, PieceType, Position, PieceColor } from '@/types/chess'

export function getInitialBoard(): (ChessPiece | null)[][] {
  const board: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null))

  const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']

  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRow[col], color: 'black' }
    board[1][col] = { type: 'pawn', color: 'black' }
  }

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

function inBounds(r: number, c: number) {
  return r >= 0 && r < 8 && c >= 0 && c < 8
}

export function findKing(board: (ChessPiece | null)[][], color: PieceColor): Position | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (p && p.type === 'king' && p.color === color) return { row: r, col: c }
    }
  }
  return null
}

export function getPseudoMoves(board: (ChessPiece | null)[][], from: Position): Position[] {
  const piece = board[from.row][from.col]
  if (!piece) return []
  const moves: Position[] = []
  const { row, col } = from
  const opp = piece.color === 'white' ? 'black' : 'white'

  const addSlide = (dr: number, dc: number) => {
    let r = row + dr, c = col + dc
    while (inBounds(r, c)) {
      const t = board[r][c]
      if (!t) moves.push({ row: r, col: c })
      else {
        if (t.color === opp) moves.push({ row: r, col: c })
        break
      }
      r += dr; c += dc
    }
  }

  if (piece.type === 'pawn') {
    const dir = piece.color === 'white' ? -1 : 1
    const startRow = piece.color === 'white' ? 6 : 1
    if (inBounds(row + dir, col) && !board[row + dir][col]) {
      moves.push({ row: row + dir, col })
      if (row === startRow && !board[row + 2 * dir][col]) {
        moves.push({ row: row + 2 * dir, col })
      }
    }
    for (const dc of [-1, 1]) {
      const r = row + dir, c = col + dc
      if (inBounds(r, c)) {
        const t = board[r][c]
        if (t && t.color === opp) moves.push({ row: r, col: c })
      }
    }
  } else if (piece.type === 'knight') {
    const deltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
    for (const [dr, dc] of deltas) {
      const r = row + dr, c = col + dc
      if (inBounds(r, c)) {
        const t = board[r][c]
        if (!t || t.color === opp) moves.push({ row: r, col: c })
      }
    }
  } else if (piece.type === 'bishop') {
    addSlide(-1,-1); addSlide(-1,1); addSlide(1,-1); addSlide(1,1)
  } else if (piece.type === 'rook') {
    addSlide(-1,0); addSlide(1,0); addSlide(0,-1); addSlide(0,1)
  } else if (piece.type === 'queen') {
    addSlide(-1,-1); addSlide(-1,1); addSlide(1,-1); addSlide(1,1)
    addSlide(-1,0); addSlide(1,0); addSlide(0,-1); addSlide(0,1)
  } else if (piece.type === 'king') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const r = row + dr, c = col + dc
        if (inBounds(r, c)) {
          const t = board[r][c]
          if (!t || t.color === opp) moves.push({ row: r, col: c })
        }
      }
    }
  }

  return moves
}

export function isSquareAttacked(board: (ChessPiece | null)[][], square: Position, byColor: PieceColor): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (p && p.color === byColor) {
        const moves = getPseudoMoves(board, { row: r, col: c })
        if (moves.some(m => m.row === square.row && m.col === square.col)) return true
      }
    }
  }
  return false
}

export function isInCheck(board: (ChessPiece | null)[][], color: PieceColor): boolean {
  const king = findKing(board, color)
  if (!king) return false
  const opp = color === 'white' ? 'black' : 'white'
  return isSquareAttacked(board, king, opp)
}

export function getLegalMoves(board: (ChessPiece | null)[][], from: Position): Position[] {
  const piece = board[from.row][from.col]
  if (!piece) return []
  const pseudo = getPseudoMoves(board, from)
  return pseudo.filter(to => {
    const newBoard = board.map(r => [...r])
    newBoard[to.row][to.col] = piece
    newBoard[from.row][from.col] = null
    return !isInCheck(newBoard, piece.color)
  })
}

export function hasAnyLegalMove(board: (ChessPiece | null)[][], color: PieceColor): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (p && p.color === color) {
        if (getLegalMoves(board, { row: r, col: c }).length > 0) return true
      }
    }
  }
  return false
}
