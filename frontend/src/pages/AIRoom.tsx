import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameStore, type ChessPiece } from '../hooks/useGameStore'
import ChessBoard from '../components/ChessBoard'
import MediaControls from '../components/MediaControls'
import Danmaku from '../components/Danmaku'

// 简单的AI评估函数
const evaluateBoard = (board: (ChessPiece | null)[][]): number => {
  const pieceValues: Record<string, number> = {
    '帅': 1000, '将': 1000,
    '仕': 20, '士': 20,
    '相': 40, '象': 40,
    '车': 90, '马': 40, '炮': 45,
    '兵': 10, '卒': 10,
  }

  let score = 0
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col]
      if (piece) {
        const value = pieceValues[piece.type] || 0
        score += piece.side === 'black' ? value : -value
      }
    }
  }
  return score
}

const getAllValidMoves = (
  board: (ChessPiece | null)[][], 
  side: 'red' | 'black'
): { from: { row: number; col: number }, to: { row: number; col: number } }[] => {
  const moves: { from: { row: number; col: number }, to: { row: number; col: number } }[] = []
  
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col]
      if (piece && piece.side === side) {
        for (let toRow = 0; toRow < 10; toRow++) {
          for (let toCol = 0; toCol < 9; toCol++) {
            if (isValidMoveSimple(row, col, toRow, toCol, board)) {
              moves.push({ from: { row, col }, to: { row: toRow, col: toCol } })
            }
          }
        }
      }
    }
  }
  return moves
}

const isValidMoveSimple = (
  fromRow: number, 
  fromCol: number, 
  toRow: number, 
  toCol: number, 
  board: (ChessPiece | null)[][]
): boolean => {
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
      return palaceRow.includes(toRow) && palaceCol.includes(toCol)

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

const minimax = (
  board: (ChessPiece | null)[][],
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number => {
  if (depth === 0) {
    return evaluateBoard(board)
  }

  const side = isMaximizing ? 'black' : 'red'
  const validMoves = getAllValidMoves(board, side)

  if (validMoves.length === 0) {
    return isMaximizing ? -10000 : 10000
  }

  if (isMaximizing) {
    let maxEval = -Infinity
    for (const move of validMoves) {
      const newBoard = board.map(r => [...r])
      newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col]
      newBoard[move.from.row][move.from.col] = null
      const evalScore = minimax(newBoard, depth - 1, false, alpha, beta)
      maxEval = Math.max(maxEval, evalScore)
      alpha = Math.max(alpha, evalScore)
      if (beta <= alpha) break
    }
    return maxEval
  } else {
    let minEval = Infinity
    for (const move of validMoves) {
      const newBoard = board.map(r => [...r])
      newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col]
      newBoard[move.from.row][move.from.col] = null
      const evalScore = minimax(newBoard, depth - 1, true, alpha, beta)
      minEval = Math.min(minEval, evalScore)
      beta = Math.min(beta, evalScore)
      if (beta <= alpha) break
    }
    return minEval
  }
}

const getAIMove = (board: (ChessPiece | null)[][]): { from: { row: number; col: number }, to: { row: number; col: number } } | null => {
  const validMoves = getAllValidMoves(board, 'black')
  if (validMoves.length === 0) return null

  let bestMove = validMoves[0]
  let bestScore = -Infinity

  for (const move of validMoves) {
    const newBoard = board.map(r => [...r])
    newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col]
    newBoard[move.from.row][move.from.col] = null
    const score = minimax(newBoard, 2, false, -Infinity, Infinity)
    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}

export default function AIRoom() {
  const navigate = useNavigate()
  const { 
    user,
    board, 
    setBoard,
    currentTurn,
    setCurrentTurn,
    isMyTurn,
    setIsMyTurn,
    setMySide,
    addMove,
    moves,
    redTime,
    blackTime,
    setRedTime,
    setBlackTime,
    setMoves
  } = useGameStore()
  const [difficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [showMediaPanel, setShowMediaPanel] = useState(false)
  const [showDanmaku, setShowDanmaku] = useState(true)

  useEffect(() => {
    setMySide('red')
    setIsMyTurn(true)
    setCurrentTurn('red')
    setGameOver(false)
    setWinner(null)
    setMoves([])
  }, [])

  useEffect(() => {
    if (gameOver) return
    const timer = setInterval(() => {
      if (currentTurn === 'red') {
        setRedTime(Math.max(0, redTime - 1))
      } else {
        setBlackTime(Math.max(0, blackTime - 1))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [currentTurn, redTime, blackTime, gameOver])

  useEffect(() => {
    if (currentTurn === 'black' && !gameOver) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board)
        if (aiMove) {
          const newBoard = board.map(r => [...r])
          const piece = newBoard[aiMove.from.row][aiMove.from.col]
          const captured = newBoard[aiMove.to.row][aiMove.to.col]
          
          if (piece) {
            addMove({
              from: aiMove.from,
              to: aiMove.to,
              piece,
              captured: captured ?? undefined,
              notation: `${piece.type}AI`
            })
          }
          
          newBoard[aiMove.to.row][aiMove.to.col] = piece
          newBoard[aiMove.from.row][aiMove.from.col] = null
          setBoard(newBoard)
          setCurrentTurn('red')
          setIsMyTurn(true)
          
          if (captured?.type === '帅' || captured?.type === '将') {
            setGameOver(true)
            setWinner('红方 (你)')
          }
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentTurn, gameOver])

  useEffect(() => {
    if (redTime === 0) {
      setGameOver(true)
      setWinner('黑方 (AI)')
    } else if (blackTime === 0) {
      setGameOver(true)
      setWinner('红方 (你)')
    }
  }, [redTime, blackTime])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleRestart = () => {
    const initialBoard: (ChessPiece | null)[][] = [
      [null, null, null, null, null, null, null, null, null],
      [{ type: '车', side: 'black' }, { type: '马', side: 'black' }, { type: '相', side: 'black' }, { type: '士', side: 'black' }, { type: '将', side: 'black' }, { type: '士', side: 'black' }, { type: '象', side: 'black' }, { type: '马', side: 'black' }, { type: '车', side: 'black' }],
      [null, null, null, null, null, null, null, null, null],
      [{ type: '炮', side: 'black' }, null, { type: '炮', side: 'black' }, null, null, null, { type: '炮', side: 'black' }, null, { type: '炮', side: 'black' }],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [{ type: '炮', side: 'red' }, null, { type: '炮', side: 'red' }, null, null, null, { type: '炮', side: 'red' }, null, { type: '炮', side: 'red' }],
      [null, null, null, null, null, null, null, null, null],
      [{ type: '车', side: 'red' }, { type: '马', side: 'red' }, { type: '相', side: 'red' }, { type: '仕', side: 'red' }, { type: '帅', side: 'red' }, { type: '仕', side: 'red' }, { type: '象', side: 'red' }, { type: '马', side: 'red' }, { type: '车', side: 'red' }],
      [null, null, null, null, null, null, null, null, null],
    ]
    setBoard(initialBoard)
    setCurrentTurn('red')
    setIsMyTurn(true)
    setGameOver(false)
    setWinner(null)
    setRedTime(600)
    setBlackTime(600)
    setMoves([])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 左侧 */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-gray-800/50 to-black/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div>
              <div className="text-white font-medium">电脑 (黑方)</div>
              <div className="text-gray-500 text-xs">难度: {difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}</div>
            </div>
          </div>
          <div className={`text-2xl font-mono text-center py-2 ${currentTurn === 'black' ? 'text-yellow-400' : 'text-gray-500'}`}>
            {formatTime(blackTime)}
          </div>
        </div>

        <div className="bg-gradient-to-r from-chinese-wood/30 to-chinese-black/50 p-4 rounded-lg border border-chinese-gold/20">
          <h3 className="text-chinese-gold font-serif text-center mb-2">人机对战</h3>
          <div className="text-center text-chinese-white/60 text-sm">
            等级: {difficulty}
          </div>
          
          <div className="mt-4 pt-4 border-t border-chinese-gold/20">
            <button
              onClick={() => setShowMediaPanel(!showMediaPanel)}
              className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                showMediaPanel 
                  ? 'bg-chinese-gold/20 text-chinese-gold border border-chinese-gold' 
                  : 'bg-black/30 text-chinese-white/70 border border-chinese-white/20 hover:border-chinese-gold/50'
              }`}
            >
              <span>📹</span> 语音/视频
            </button>
          </div>
        </div>

        {showMediaPanel && user && (
          <div className="bg-gradient-to-r from-chinese-wood/30 to-chinese-black/50 p-4 rounded-lg border border-chinese-gold/30">
            <MediaControls />
          </div>
        )}

        <div className="bg-gradient-to-r from-red-900/50 to-black/50 p-4 rounded-lg border border-red-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-chinese-red rounded-full flex items-center justify-center text-white font-bold">
              你
            </div>
            <div>
              <div className="text-white font-medium">玩家 (红方)</div>
              <div className="text-red-400 text-xs">执红</div>
            </div>
          </div>
          <div className={`text-2xl font-mono text-center py-2 ${currentTurn === 'red' ? 'text-yellow-400' : 'text-gray-500'}`}>
            {formatTime(redTime)}
          </div>
        </div>

        <button onClick={handleRestart} className="w-full btn-chinese">
          重新开始
        </button>
        
        <button 
          onClick={() => navigate('/lobby')}
          className="w-full py-2 border border-chinese-white/30 text-chinese-white rounded hover:bg-chinese-white/10"
        >
          返回大厅
        </button>
      </div>

      {/* 中间 */}
      <div className="lg:col-span-2">
        <div className="flex justify-center">
          <ChessBoard />
        </div>
        
        {showDanmaku && user && (
          <div className="mt-4">
            <Danmaku username={user.username} isVisible={true} />
          </div>
        )}
        
        <div className="text-center mt-4">
          <motion.div
            key={currentTurn}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-block px-6 py-2 rounded-full ${
              currentTurn === 'red' 
                ? 'bg-chinese-red/20 text-chinese-red border border-chinese-red' 
                : 'bg-gray-700/50 text-gray-300 border border-gray-600'
            }`}
          >
            {gameOver ? `游戏结束 - ${winner}获胜！` : isMyTurn ? '轮到你了！' : 'AI思考中...'}
          </motion.div>
        </div>
      </div>

      {/* 右侧 */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-chinese-wood/30 to-chinese-black/50 p-4 rounded-lg border border-chinese-gold/20 h-64 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-chinese-gold font-serif">棋谱</h3>
            <button
              onClick={() => setShowDanmaku(!showDanmaku)}
              className={`text-xs px-2 py-1 rounded ${
                showDanmaku 
                  ? 'bg-chinese-gold/20 text-chinese-gold' 
                  : 'bg-black/30 text-chinese-white/50'
              }`}
            >
              {showDanmaku ? '弹幕ON' : '弹幕OFF'}
            </button>
          </div>
          <div className="space-y-1 text-sm">
            {moves.length === 0 ? (
              <div className="text-chinese-white/50 text-center py-4">暂无棋步</div>
            ) : (
              moves.map((move, index) => (
                <div key={index} className="flex gap-2 text-chinese-white/80">
                  <span className="text-chinese-gold w-6">{index + 1}.</span>
                  <span>{move.notation}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
