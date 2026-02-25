import { useGameStore, type ChessPiece } from '../hooks/useGameStore'
import { motion } from 'framer-motion'

export default function ChessBoard() {
  const { 
    board, 
    selectedPiece, 
    setSelectedPiece, 
    mySide,
    isMyTurn,
    setBoard,
    addMove,
    setCurrentTurn,
    setIsMyTurn
  } = useGameStore()

  const handlePieceClick = (row: number, col: number) => {
    if (!isMyTurn || !mySide) return

    const piece = board[row][col]
    
    if (piece && piece.side === mySide) {
      setSelectedPiece({ row, col })
      return
    }

    if (selectedPiece && piece?.side !== mySide) {
      if (isValidMove(selectedPiece.row, selectedPiece.col, row, col, board)) {
        const newBoard = board.map(r => [...r])
        const movingPiece = newBoard[selectedPiece.row][selectedPiece.col]
        
        if (movingPiece) {
          addMove({
            from: { row: selectedPiece.row, col: selectedPiece.col },
            to: { row, col },
            piece: movingPiece,
            captured: piece ?? undefined,
            notation: `${movingPiece.type}${getPositionName(selectedPiece.row, col)}${piece ? '吃' : ''}${getPositionName(row, col)}`
          })
        }

        newBoard[row][col] = movingPiece
        newBoard[selectedPiece.row][selectedPiece.col] = null
        
        setBoard(newBoard)
        setSelectedPiece(null)
        setCurrentTurn(mySide === 'red' ? 'black' : 'red')
        setIsMyTurn(false)
      }
    }
  }

  const getPositionName = (row: number, col: number): string => {
    const cols = '九八七六五四三二一'
    const rows = '一二三四五六七八九'
    const colName = cols[8 - col]
    const rowName = rows[row]
    return `${colName}${rowName}`
  }

  return (
    <div className="relative">
      <div className="chess-board p-2 relative">
        <div className="grid grid-rows-10 grid-cols-9 gap-0 bg-chinese-wood/20">
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={`row-${row}`} className="contents">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                <div
                  key={`${row}-${col}`}
                  className="aspect-square border border-chinese-gold/40 bg-chinese-wood/10 relative flex items-center justify-center"
                >
                  <ChessPieceComponent 
                    piece={board[row][col] ?? undefined} 
                    isSelected={selectedPiece?.row === row && selectedPiece?.col === col}
                    onClick={() => handlePieceClick(row, col)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="h-16 river relative">
          <div className="absolute inset-0 flex items-center justify-center gap-8">
            <span className="river-text">楚</span>
            <span className="river-text">河</span>
            <span className="river-text">汉</span>
            <span className="river-text">界</span>
          </div>
        </div>

        <div className="grid grid-rows-10 grid-cols-9 gap-0 bg-chinese-wood/20">
          {[5, 6, 7, 8, 9].map((row) => (
            <div key={`row-${row}`} className="contents">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                <div
                  key={`${row}-${col}`}
                  className="aspect-square border border-chinese-gold/40 bg-chinese-wood/10 relative flex items-center justify-center"
                >
                  <ChessPieceComponent 
                    piece={board[row][col] ?? undefined} 
                    isSelected={selectedPiece?.row === row && selectedPiece?.col === col}
                    onClick={() => handlePieceClick(row, col)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChessPieceComponent({ 
  piece, 
  isSelected, 
  onClick 
}: { 
  piece: ChessPiece | null | undefined
  isSelected: boolean
  onClick: () => void
}) {
  if (!piece) return null

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        chess-piece ${piece.side} ${isSelected ? 'selected' : ''}
        w-[90%] h-[90%] text-lg sm:text-xl md:text-2xl lg:text-3xl
        flex items-center justify-center cursor-pointer
      `}
    >
      {piece.type}
    </motion.div>
  )
}

function isValidMove(
  fromRow: number, 
  fromCol: number, 
  toRow: number, 
  toCol: number, 
  board: (ChessPiece | null)[][]
): boolean {
  const piece = board[fromRow][fromCol]
  if (!piece) return false

  const rowDiff = Math.abs(toRow - fromRow)
  const colDiff = Math.abs(toCol - fromCol)

  switch (piece.type) {
    case '帅':
    case '将':
      if (colDiff > 1 || rowDiff > 1) return false
      const palaceRow = piece.side === 'red' ? [7, 8, 9] : [0, 1]
      const palaceCol = [3, 4, 5]
      if (!palaceRow.includes(toRow) || !palaceCol.includes(toCol)) return false
      if (board[toRow][toCol]?.type === (piece.side === 'red' ? '将' : '帅')) {
        const midRow = (fromRow + toRow) / 2
        for (let c = 3; c <= 5; c++) {
          if (board[midRow][c] === null) return true
        }
        return false
      }
      return true

    case '仕':
    case '士':
      if (rowDiff !== 1 || colDiff !== 1) return false
      const palaceRowS = piece.side === 'red' ? [7, 8, 9] : [0, 1]
      const palaceColS = [3, 4, 5]
      return palaceRowS.includes(toRow) && palaceColS.includes(toCol)

    case '相':
    case '象':
      if (rowDiff !== 2 || colDiff !== 2) return false
      if (piece.side === 'black' && toRow > 4) return false
      if (piece.side === 'red' && toRow < 5) return false
      const midRowX = (fromRow + toRow) / 2
      const midColX = (fromCol + toCol) / 2
      return board[midRowX][midColX] === null

    case '车':
      if (rowDiff !== 0 && colDiff !== 0) return false
      if (rowDiff === 0) {
        const minC = Math.min(fromCol, toCol)
        const maxC = Math.max(fromCol, toCol)
        for (let c = minC + 1; c < maxC; c++) {
          if (board[fromRow][c] !== null) return false
        }
      } else {
        const minR = Math.min(fromRow, toRow)
        const maxR = Math.max(fromRow, toRow)
        for (let r = minR + 1; r < maxR; r++) {
          if (board[r][fromCol] !== null) return false
        }
      }
      return true

    case '马':
      if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) 
        return false
      const legRow = fromRow + (toRow > fromRow ? 1 : -1)
      const legCol = fromCol + (toCol > fromCol ? 1 : -1)
      if (rowDiff === 2) {
        return board[legRow][fromCol] === null
      } else {
        return board[fromRow][legCol] === null
      }

    case '炮':
      if (rowDiff !== 0 && colDiff !== 0) return false
      let piecesBetween = 0
      if (rowDiff === 0) {
        const minC = Math.min(fromCol, toCol)
        const maxC = Math.max(fromCol, toCol)
        for (let c = minC + 1; c < maxC; c++) {
          if (board[fromRow][c] !== null) piecesBetween++
        }
      } else {
        const minR = Math.min(fromRow, toRow)
        const maxR = Math.max(fromRow, toRow)
        for (let r = minR + 1; r < maxR; r++) {
          if (board[r][fromCol] !== null) piecesBetween++
        }
      }
      const targetPiece = board[toRow][toCol]
      if (targetPiece === null) {
        return piecesBetween === 0
      } else {
        return piecesBetween === 1
      }

    case '兵':
    case '卒':
      const forward = piece.side === 'red' ? -1 : 1
      const crossedRiver = piece.side === 'red' ? fromRow <= 4 : fromRow >= 5
      
      if (!crossedRiver) {
        return toRow === fromRow + forward && colDiff === 0
      } else {
        return (toRow === fromRow + forward && colDiff === 0) || 
               (rowDiff === 0 && colDiff === 1)
      }

    default:
      return false
  }
}
