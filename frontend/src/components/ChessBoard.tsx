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
    console.log('Clicked:', row, col, 'isMyTurn:', isMyTurn, 'mySide:', mySide)
    
    if (!mySide || !isMyTurn) {
      console.log('Not your turn or no side assigned')
      return
    }

    const piece = board[row][col]
    
    // 如果点击的是自己的棋子，选择它
    if (piece && piece.side === mySide) {
      console.log('Selected own piece:', piece)
      setSelectedPiece({ row, col })
      return
    }

    // 如果已经选择了棋子，尝试移动
    if (selectedPiece) {
      const movingPiece = board[selectedPiece.row][selectedPiece.col]
      
      // 点击了己方另一个棋子，切换选择
      if (piece && piece.side === mySide) {
        setSelectedPiece({ row, col })
        return
      }
      
      // 尝试移动到空位或敌方棋子
      if (movingPiece) {
        if (isValidMove(selectedPiece.row, selectedPiece.col, row, col, board)) {
          console.log('Valid move!')
          // 执行移动
          const newBoard = board.map(r => [...r])
          
          // 记录棋步
          addMove({
            from: { row: selectedPiece.row, col: selectedPiece.col },
            to: { row, col },
            piece: movingPiece,
            captured: piece ?? undefined,
            notation: `${movingPiece.type}${getPositionName(row, col)}`
          })

          newBoard[row][col] = movingPiece
          newBoard[selectedPiece.row][selectedPiece.col] = null
          
          setBoard(newBoard)
          setSelectedPiece(null)
          setCurrentTurn(mySide === 'red' ? 'black' : 'red')
          setIsMyTurn(false)
        } else {
          console.log('Invalid move')
        }
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
    <div className="flex flex-col items-center">
      {/* 棋盘容器 */}
      <div className="chess-board p-1 md:p-2 lg:p-3 relative">
        {/* 上半部分 (黑方阵地) - 显示为红方视角 */}
        <div className="grid grid-rows-5 grid-cols-9 gap-0 bg-chinese-wood/20">
          {[1, 2, 3, 4, 0].map((row) => (
            <div key={`top-${row}`} className="contents">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                <div
                  key={`top-${row}-${col}`}
                  className="aspect-square border border-chinese-gold/40 bg-chinese-wood/10 relative flex items-center justify-center cursor-pointer"
                  onClick={() => handlePieceClick(row, col)}
                >
                  <ChessPieceComponent 
                    piece={board[row]?.[col] ?? undefined} 
                    isSelected={selectedPiece?.row === row && selectedPiece?.col === col}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 楚河汉界 */}
        <div className="h-6 md:h-8 lg:h-10 river relative">
          <div className="absolute inset-0 flex items-center justify-center gap-2 md:gap-4">
            <span className="river-text text-xs md:text-sm">楚河</span>
            <span className="river-text text-xs md:text-sm">汉界</span>
          </div>
        </div>

        {/* 下半部分 (红方阵地) */}
        <div className="grid grid-rows-5 grid-cols-9 gap-0 bg-chinese-wood/20">
          {[5, 6, 7, 8, 9].map((row) => (
            <div key={`bottom-${row}`} className="contents">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                <div
                  key={`bottom-${row}-${col}`}
                  className="aspect-square border border-chinese-gold/40 bg-chinese-wood/10 relative flex items-center justify-center cursor-pointer"
                  onClick={() => handlePieceClick(row, col)}
                >
                  <ChessPieceComponent 
                    piece={board[row]?.[col] ?? undefined} 
                    isSelected={selectedPiece?.row === row && selectedPiece?.col === col}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* 九宫斜线装饰 - 上方 */}
        <div className="absolute top-[8%] left-[8%] w-[18%] h-[8%] border-t-2 border-b-2 border-chinese-gold/60 hidden md:block" />
        <div className="absolute top-[8%] left-[8%] w-[18%] h-[8%] border-l-2 border-r-2 border-chinese-gold/60 hidden md:block" />
        <div className="absolute top-[8%] right-[8%] w-[18%] h-[8%] border-t-2 border-b-2 border-chinese-gold/60 hidden md:block" />
        <div className="absolute top-[8%] right-[8%] w-[18%] h-[8%] border-l-2 border-r-2 border-chinese-gold/60 hidden md:block" />
        
        {/* 九宫斜线装饰 - 下方 */}
        <div className="absolute bottom-[8%] left-[8%] w-[18%] h-[8%] border-t-2 border-b-2 border-chinese-gold/60 hidden md:block" />
        <div className="absolute bottom-[8%] left-[8%] w-[18%] h-[8%] border-l-2 border-r-2 border-chinese-gold/60 hidden md:block" />
        <div className="absolute bottom-[8%] right-[8%] w-[18%] h-[8%] border-t-2 border-b-2 border-chinese-gold/60 hidden md:block" />
        <div className="absolute bottom-[8%] right-[8%] w-[18%] h-[8%] border-l-2 border-r-2 border-chinese-gold/60 hidden md:block" />
      </div>
    </div>
  )
}

function ChessPieceComponent({ 
  piece, 
  isSelected
}: { 
  piece: ChessPiece | null | undefined
  isSelected: boolean
}) {
  if (!piece) return null

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={`
        chess-piece ${piece.side} ${isSelected ? 'selected' : ''}
        w-[85%] h-[85%] text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl
        flex items-center justify-center cursor-pointer select-none
      `}
    >
      {piece.type}
    </motion.div>
  )
}

// 完整的象棋规则验证
function isValidMove(
  fromRow: number, 
  fromCol: number, 
  toRow: number, 
  toCol: number, 
  board: (ChessPiece | null)[][]
): boolean {
  const piece = board[fromRow]?.[fromCol]
  if (!piece) return false

  const rowDiff = Math.abs(toRow - fromRow)
  const colDiff = Math.abs(toCol - fromCol)

  switch (piece.type) {
    case '帅':
    case '将': {
      // 帅将只能在九宫内走一步
      if (colDiff > 1 || rowDiff > 1) return false
      // 不能走出九宫
      const palaceRow = piece.side === 'red' ? [7, 8, 9] : [0, 1]
      const palaceCol = [3, 4, 5]
      if (!palaceRow.includes(toRow) || !palaceCol.includes(toCol)) return false
      // 面对面规则
      const target = board[toRow]?.[toCol]
      if (target?.type === (piece.side === 'red' ? '将' : '帅')) {
        // 检查中间是否有阻挡
        for (let c = 3; c <= 5; c++) {
          if (board[piece.side === 'red' ? 8 : 1]?.[c] === null) return true
        }
        return false
      }
      return true
    }

    case '仕':
    case '士':
      // 士斜走一步
      if (rowDiff !== 1 || colDiff !== 1) return false
      // 不能走出九宫
      const palaceRowS = piece.side === 'red' ? [7, 8, 9] : [0, 1]
      const palaceColS = [3, 4, 5]
      return palaceRowS.includes(toRow) && palaceColS.includes(toCol)

    case '相':
    case '象':
      // 相走田字，不能过河
      if (rowDiff !== 2 || colDiff !== 2) return false
      if (piece.side === 'black' && toRow > 4) return false
      if (piece.side === 'red' && toRow < 5) return false
      // 塞象眼
      const midRowX = (fromRow + toRow) / 2
      const midColX = (fromCol + toCol) / 2
      return board[midRowX]?.[midColX] === null

    case '车':
      // 车走直线
      if (rowDiff !== 0 && colDiff !== 0) return false
      // 检查中间是否有阻挡
      if (rowDiff === 0) {
        const minC = Math.min(fromCol, toCol)
        const maxC = Math.max(fromCol, toCol)
        for (let c = minC + 1; c < maxC; c++) {
          if (board[fromRow]?.[c] !== null) return false
        }
      } else {
        const minR = Math.min(fromRow, toRow)
        const maxR = Math.max(fromRow, toRow)
        for (let r = minR + 1; r < maxR; r++) {
          if (board[r]?.[fromCol] !== null) return false
        }
      }
      return true

    case '马':
      // 马走日
      if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) 
        return false
      // 别马腿
      if (rowDiff === 2) {
        const legRow = fromRow + (toRow > fromRow ? 1 : -1)
        return board[legRow]?.[fromCol] === null
      } else {
        const legCol = fromCol + (toCol > fromCol ? 1 : -1)
        return board[fromRow]?.[legCol] === null
      }

    case '炮': {
      // 炮走直线，吃子时需要隔一子
      if (rowDiff !== 0 && colDiff !== 0) return false
      let piecesBetween = 0
      if (rowDiff === 0) {
        const minC = Math.min(fromCol, toCol)
        const maxC = Math.max(fromCol, toCol)
        for (let c = minC + 1; c < maxC; c++) {
          if (board[fromRow]?.[c] !== null) piecesBetween++
        }
      } else {
        const minR = Math.min(fromRow, toRow)
        const maxR = Math.max(fromRow, toRow)
        for (let r = minR + 1; r < maxR; r++) {
          if (board[r]?.[fromCol] !== null) piecesBetween++
        }
      }
      const target = board[toRow]?.[toCol]
      if (!target) {
        return piecesBetween === 0
      } else {
        return piecesBetween === 1
      }
    }

    case '兵':
    case '卒':
      // 兵过河前只能向前，过河后可左右或向前
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
