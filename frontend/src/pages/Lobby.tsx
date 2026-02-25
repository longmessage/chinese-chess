import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameStore, Room } from '../hooks/useGameStore'

export default function Lobby() {
  const { user, rooms, setRooms, addRoom } = useGameStore()
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [roomName, setRoomName] = useState('')

  // 模拟房间数据
  useEffect(() => {
    if (rooms.length === 0) {
      setRooms([
        { id: '1', name: '高手对局', player1: { id: '1', username: '棋王', email: '', level: 8, wins: 80, losses: 20, draws: 5 }, player2: { id: '2', username: '象棋大师', email: '', level: 7, wins: 70, losses: 25, draws: 10 }, status: 'playing', spectators: 5 },
        { id: '2', name: '新手练习', player1: { id: '3', username: '初学者', email: '', level: 1, wins: 5, losses: 10, draws: 2 }, status: 'waiting', spectators: 0 },
        { id: '3', name: '友谊赛', player2: { id: '4', username: '棋友', email: '', level: 3, wins: 30, losses: 15, draws: 5 }, status: 'waiting', spectators: 2 },
      ])
    }
  }, [])

  const handleCreateRoom = () => {
    if (!user) return
    const newRoom: Room = {
      id: Date.now().toString(),
      name: roomName || `${user.username}的房间`,
      player1: user,
      status: 'waiting',
      spectators: 0
    }
    addRoom(newRoom)
    navigate(`/room/${newRoom.id}`)
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-serif text-chinese-gold mb-4">请先登录</h2>
        <Link to="/login" className="btn-chinese">登录</Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 标题区域 */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif text-chinese-gold font-bold">游戏大厅</h2>
        <div className="flex gap-4">
          <Link 
            to="/ai"
            className="px-6 py-2 bg-gradient-to-r from-chinese-bamboo to-green-700 text-white rounded border border-green-500 hover:from-chinese-bamboo/80 hover:to-green-600 transition-all font-serif"
          >
            🤖 人机对战
          </Link>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-chinese"
          >
            创建房间
          </button>
        </div>
      </div>

      {/* 在线用户信息 */}
      <div className="bg-gradient-to-r from-chinese-wood/30 to-chinese-black/50 p-4 rounded-lg border border-chinese-gold/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-chinese-gold rounded-full flex items-center justify-center text-chinese-black font-bold text-xl">
              {user.username[0]}
            </div>
            <div>
              <div className="text-chinese-white font-medium">{user.username}</div>
              <div className="text-chinese-white/60 text-sm">
                等级 Lv.{user.level} · 胜率 {user.wins + user.losses > 0 ? Math.round(user.wins / (user.wins + user.losses) * 100) : 0}%
              </div>
            </div>
          </div>
          <div className="text-chinese-gold text-sm">
            在线用户: {rooms.length * 2 + 10}
          </div>
        </div>
      </div>

      {/* 房间列表 */}
      <div className="grid gap-4">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-r from-chinese-wood/20 to-chinese-black/40 p-4 rounded-lg border border-chinese-gold/10 hover:border-chinese-gold/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${room.status === 'playing' ? 'bg-green-500 animate-pulse' : 'bg-chinese-gold'}`} />
                <div>
                  <div className="text-chinese-white font-medium">{room.name}</div>
                  <div className="text-chinese-white/60 text-sm">
                    {room.player1?.username} {room.player2 ? `vs ${room.player2.username}` : '等待对手...'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-chinese-white/50 text-sm">
                  👁️ {room.spectators}
                </div>
                <Link 
                  to={`/room/${room.id}`}
                  className={`px-4 py-2 rounded ${room.status === 'waiting' ? 'bg-chinese-gold/20 text-chinese-gold border border-chinese-gold/50 hover:bg-chinese-gold/30' : 'bg-chinese-red/20 text-chinese-red border border-chinese-red/50'}`}
                >
                  {room.status === 'waiting' ? '加入' : '观战'}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 创建房间弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-chinese-wood/50 to-chinese-black p-8 rounded-lg border border-chinese-gold/30 max-w-md w-full mx-4"
          >
            <h3 className="text-2xl font-serif text-chinese-gold font-bold mb-6 text-center">
              创建房间
            </h3>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="房间名称（可选）"
              className="input-chinese w-full mb-6"
            />
            <div className="flex gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 border border-chinese-white/30 text-chinese-white rounded hover:bg-chinese-white/10 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateRoom}
                className="flex-1 btn-chinese"
              >
                创建
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
