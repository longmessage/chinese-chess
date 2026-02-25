import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'
import ChessBoard from '../components/ChessBoard'
import MediaControls from '../components/MediaControls'
import Danmaku from '../components/Danmaku'

export default function Room() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { 
    user, 
    currentRoom, 
    setCurrentRoom,
    setMySide,
    setIsMyTurn,
    isMyTurn,
    currentTurn,
    redTime,
    blackTime,
    setRedTime,
    setBlackTime,
    moves,
  } = useGameStore()
  const [chatMessages, setChatMessages] = useState<{user: string, text: string}[]>([])
  const [chatInput, setChatInput] = useState('')
  const [showMediaPanel, setShowMediaPanel] = useState(false)
  const [showDanmaku, setShowDanmaku] = useState(true)

  // 初始化房间
  useEffect(() => {
    if (!currentRoom) {
      setCurrentRoom({
        id: roomId || '1',
        name: '游戏房间',
        player1: user || undefined,
        status: 'waiting',
        spectators: 0
      })
    }
    // 设置为红方且可以移动
    if (user) {
      setMySide('red')
      setIsMyTurn(true)
    }
  }, [roomId, user])

  // 计时器
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentTurn === 'red') {
        setRedTime(Math.max(0, redTime - 1))
      } else {
        setBlackTime(Math.max(0, blackTime - 1))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [currentTurn, redTime, blackTime])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleSendChat = () => {
    if (chatInput.trim() && user) {
      setChatMessages([...chatMessages, { user: user.username, text: chatInput }])
      setChatInput('')
    }
  }

  const handleGiveUp = () => {
    if (confirm('确定要认输吗？')) {
      navigate('/lobby')
    }
  }

  const handleDraw = () => {
    alert('求和请求已发送')
  }

  const handleUndo = () => {
    alert('悔棋请求已发送')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 左侧：玩家信息 */}
      <div className="space-y-4">
        {/* 黑方 */}
        <div className="bg-gradient-to-r from-gray-800/50 to-black/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
              黑
            </div>
            <div>
              <div className="text-white font-medium">
                {currentRoom?.player2?.username || '等待加入...'}
              </div>
              <div className="text-gray-500 text-xs">执黑</div>
            </div>
          </div>
          <div className={`text-2xl font-mono text-center py-2 ${currentTurn === 'black' ? 'text-yellow-400' : 'text-gray-500'}`}>
            {formatTime(blackTime)}
          </div>
        </div>

        {/* 对局信息 */}
        <div className="bg-gradient-to-r from-chinese-wood/30 to-chinese-black/50 p-4 rounded-lg border border-chinese-gold/20">
          <h3 className="text-chinese-gold font-serif text-center mb-2">{currentRoom?.name}</h3>
          <div className="text-center text-chinese-white/60 text-sm">
            房间号: {roomId}
          </div>
          <div className="text-center text-chinese-white/60 text-sm mt-1">
            👁️ 观战: {currentRoom?.spectators || 0}人
          </div>
          
          {/* 语音视频按钮 */}
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

        {/* 语音视频面板 */}
        {showMediaPanel && user && (
          <div className="bg-gradient-to-r from-chinese-wood/30 to-chinese-black/50 p-4 rounded-lg border border-chinese-gold/30">
            <MediaControls />
          </div>
        )}

        {/* 红方 */}
        <div className="bg-gradient-to-r from-red-900/50 to-black/50 p-4 rounded-lg border border-red-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-chinese-red rounded-full flex items-center justify-center text-white font-bold">
              红
            </div>
            <div>
              <div className="text-white font-medium">
                {currentRoom?.player1?.username || '等待加入...'}
              </div>
              <div className="text-red-400 text-xs">执红</div>
            </div>
          </div>
          <div className={`text-2xl font-mono text-center py-2 ${currentTurn === 'red' ? 'text-yellow-400' : 'text-gray-500'}`}>
            {formatTime(redTime)}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="grid grid-cols-3 gap-2">
          <button onClick={handleUndo} className="py-2 bg-chinese-gold/20 text-chinese-gold rounded text-sm hover:bg-chinese-gold/30">
            悔棋
          </button>
          <button onClick={handleDraw} className="py-2 bg-chinese-gold/20 text-chinese-gold rounded text-sm hover:bg-chinese-gold/30">
            求和
          </button>
          <button onClick={handleGiveUp} className="py-2 bg-chinese-red/20 text-chinese-red rounded text-sm hover:bg-chinese-red/30">
            认输
          </button>
        </div>

        {/* 返回大厅 */}
        <button 
          onClick={() => navigate('/lobby')}
          className="w-full py-2 border border-chinese-white/30 text-chinese-white rounded hover:bg-chinese-white/10"
        >
          返回大厅
        </button>
      </div>

      {/* 中间：棋盘 */}
      <div className="lg:col-span-2">
        <div className="flex justify-center">
          <ChessBoard />
        </div>
        
        {/* 弹幕 */}
        {showDanmaku && user && (
          <div className="mt-4">
            <Danmaku 
              username={user.username} 
              isVisible={true}
            />
          </div>
        )}
        
        {/* 当前走棋提示 */}
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
            {isMyTurn ? '轮到你了！' : `${currentTurn === 'red' ? '红方' : '黑方'}走棋`}
          </motion.div>
        </div>
      </div>

      {/* 右侧：棋谱和聊天 */}
      <div className="space-y-4">
        {/* 棋谱 */}
        <div className="bg-gradient-to-r from-chinese-wood/30 to-chinese-black/50 p-4 rounded-lg border border-chinese-gold/20 h-48 overflow-y-auto">
          <h3 className="text-chinese-gold font-serif mb-2">棋谱</h3>
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

        {/* 聊天 */}
        <div className="bg-gradient-to-r from-chinese-wood/30 to-chinese-black/50 p-4 rounded-lg border border-chinese-gold/20 h-64 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-chinese-gold font-serif">聊天</h3>
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
          <div className="flex-1 overflow-y-auto space-y-2 mb-2">
            {chatMessages.map((msg, index) => (
              <div key={index} className="text-sm">
                <span className="text-chinese-gold">{msg.user}: </span>
                <span className="text-chinese-white/80">{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendChat()}
              placeholder="发送消息..."
              className="flex-1 bg-black/30 border border-chinese-gold/30 rounded px-3 py-1 text-white text-sm"
            />
            <button 
              onClick={handleSendChat}
              className="px-3 py-1 bg-chinese-gold/20 text-chinese-gold rounded text-sm hover:bg-chinese-gold/30"
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
