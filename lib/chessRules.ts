import { ChessPiece, Position, PieceColor, PieceType, Move } from '@/types/chess'

type Board = (ChessPiece | null)[][]

export function isInBounds(pos: Position): boolean {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8
}

export function findKing(board: Board, color: PieceColor): Position | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c]
      if (p && p.type === 'king' && p.color === color) return { row: r, col: c }
    }
  }
  return null
}

function getPawnMoves(board: Board, from: Position, piece: ChessPiece, lastMove?: Move): Position[] {
  const moves: Position[] = []
  const dir = piece.color === 'white' ? -1 : 1
  const startRow = piece.color === 'white' ? 6 : 1

  const oneStep = { row: from.row + dir, col: from.col }
  if (isInBounds(oneStep) && !board[oneStep.row][oneStep.col]) {
    moves.push(oneStep)
    const twoStep = { row: from.row + 2 * dir, col: from.col }
    if (from.row === startRow && !board[twoStep.row][twoStep.col]) {
      moves.push(twoStep)
    }
  }

  for (const dc of [-1, 1]) {
    const cap = { row: from.row + dir, col: from.col + dc }
    if (!isInBounds(cap)) continue
    const target = board[cap.row][cap.col]
    if (target && target.color !== piece.color) {
      moves.push(cap)
    }
    // En passant
    if (lastMove && lastMove.piece.type === 'pawn' &&
        Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
        lastMove.to.row === from.row &&
        lastMove.to.col === from.col + dc) {
      moves.push(cap)
    }
  }

  return moves
}

function getSlidingMoves(board: Board, from: Position, piece: ChessPiece, directions: number[][]): Position[] {
  const moves: Position[] = []
  for (const [dr, dc] of directions) {
    let r = from.row + dr
    let c = from.col + dc
    while (isInBounds({ row: r, col: c })) {
      const target = board[r][c]
      if (!target) {
        moves.push({ row: r, col: c })
      } else {
        if (target.color !== piece.color) moves.push({ row: r, col: c })
        break
      }
      r += dr
      c += dc
    }
  }
  return moves
}

function getKnightMoves(board: Board, from: Position, piece: ChessPiece): Position[] {
  const offsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
  const moves: Position[] = []
  for (const [dr, dc] of offsets) {
    const pos = { row: from.row + dr, col: from.col + dc }
    if (!isInBounds(pos)) continue
    const target = board[pos.row][pos.col]
    if (!target || target.color !== piece.color) moves.push(pos)
  }
  return moves
}

function getKingMoves(board: Board, from: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const pos = { row: from.row + dr, col: from.col + dc }
      if (!isInBounds(pos)) continue
      const target = board[pos.row][pos.col]
      if (!target || target.color !== piece.color) moves.push(pos)
    }
  }
  return moves
}

export function getPseudoLegalMoves(board: Board, from: Position, lastMove?: Move): Position[] {
  const piece = board[from.row][from.col]
  if (!piece) return []

  switch (piece.type) {
    case 'pawn':
      return getPawnMoves(board, from, piece, lastMove)
    case 'knight':
      return getKnightMoves(board, from, piece)
    case 'bishop':
      return getSlidingMoves(board, from, piece, [[-1,-1],[-1,1],[1,-1],[1,1]])
    case 'rook':
      return getSlidingMoves(board, from, piece, [[-1,0],[1,0],[0,-1],[0,1]])
    case 'queen':
      return getSlidingMoves(board, from, piece, [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]])
    case 'king':
      return getKingMoves(board, from, piece)
  }
}

export function isSquareAttacked(board: Board, pos: Position, byColor: PieceColor): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (!piece || piece.color !== byColor) continue
      if (piece.type === 'pawn') {
        const dir = piece.color === 'white' ? -1 : 1
        if (r + dir === pos.row && (c - 1 === pos.col || c + 1 === pos.col)) return true
      } else {
        const moves = getPseudoLegalMoves(board, { row: r, col: c })
        if (moves.some(m => m.row === pos.row && m.col === pos.col)) return true
      }
    }
  }
  return false
}

export function isInCheck(board: Board, color: PieceColor): boolean {
  const king = findKing(board, color)
  if (!king) return false
  return isSquareAttacked(board, king, color === 'white' ? 'black' : 'white')
}

function simulateMove(board: Board, from: Position, to: Position): Board {
  const newBoard = board.map(r => [...r])
  newBoard[to.row][to.col] = newBoard[from.row][from.col]
  newBoard[from.row][from.col] = null
  return newBoard
}

export function getLegalMoves(board: Board, from: Position, lastMove?: Move): Position[] {
  const piece = board[from.row][from.col]
  if (!piece) return []
  const pseudo = getPseudoLegalMoves(board, from, lastMove)
  const legal = pseudo.filter(to => {
    const sim = simulateMove(board, from, to)
    return !isInCheck(sim, piece.color)
  })

  // Castling
  if (piece.type === 'king' && !piece.hasMoved && !isInCheck(board, piece.color)) {
    const row = from.row
    // Kingside
    const kr = board[row][7]
    if (kr && kr.type === 'rook' && kr.color === piece.color && !kr.hasMoved &&
        !board[row][5] && !board[row][6]) {
      const opp = piece.color === 'white' ? 'black' : 'white'
      if (!isSquareAttacked(board, { row, col: 5 }, opp) &&
          !isSquareAttacked(board, { row, col: 6 }, opp)) {
        legal.push({ row, col: 6 })
      }
    }
    // Queenside
    const qr = board[row][0]
    if (qr && qr.type === 'rook' && qr.color === piece.color && !qr.hasMoved &&
        !board[row][1] && !board[row][2] && !board[row][3]) {
      const opp = piece.color === 'white' ? 'black' : 'white'
      if (!isSquareAttacked(board, { row, col: 3 }, opp) &&
          !isSquareAttacked(board, { row, col: 2 }, opp)) {
        legal.push({ row, col: 2 })
      }
    }
  }

  return legal
}

export function hasAnyLegalMove(board: Board, color: PieceColor, lastMove?: Move): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (!piece || piece.color !== color) continue
      if (getLegalMoves(board, { row: r, col: c }, lastMove).length > 0) return true
    }
  }
  return false
}

export function isCheckmate(board: Board, color: PieceColor, lastMove?: Move): boolean {
  return isInCheck(board, color) && !hasAnyLegalMove(board, color, lastMove)
}

export function isStalemate(board: Board, color: PieceColor, lastMove?: Move): boolean {
  return !isInCheck(board, color) && !hasAnyLegalMove(board, color, lastMove)
}
