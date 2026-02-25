import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../hooks/useGameStore'

export default function Profile() {
  const { user, logout } = useGameStore()
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  const totalGames = user.wins + user.losses + user.draws
  const winRate = totalGames > 0 ? Math.round((user.wins / totalGames) * 100) : 0

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* 用户信息卡片 */}
      <div className="bg-gradient-to-br from-chinese-wood/30 to-chinese-black/50 p-8 rounded-lg border border-chinese-gold/20">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-chinese-gold to-yellow-600 rounded-full flex items-center justify-center text-chinese-black font-bold text-4xl shadow-lg">
            {user.username[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-serif text-chinese-gold font-bold mb-2">
              {user.username}
            </h2>
            <div className="flex items-center gap-4 text-chinese-white/70">
              <span className="px-3 py-1 bg-chinese-gold/20 rounded-full text-chinese-gold">
                Lv.{user.level}
              </span>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 战绩统计 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-900/30 to-black/50 p-6 rounded-lg border border-green-800 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">{user.wins}</div>
          <div className="text-chinese-white/60 text-sm">胜利</div>
        </div>
        <div className="bg-gradient-to-br from-red-900/30 to-black/50 p-6 rounded-lg border border-red-800 text-center">
          <div className="text-3xl font-bold text-red-400 mb-1">{user.losses}</div>
          <div className="text-chinese-white/60 text-sm">失败</div>
        </div>
        <div className="bg-gradient-to-br from-gray-700/30 to-black/50 p-6 rounded-lg border border-gray-600 text-center">
          <div className="text-3xl font-bold text-gray-400 mb-1">{user.draws}</div>
          <div className="text-chinese-white/60 text-sm">平局</div>
        </div>
        <div className="bg-gradient-to-br from-chinese-gold/20 to-black/50 p-6 rounded-lg border border-chinese-gold/50 text-center">
          <div className="text-3xl font-bold text-chinese-gold mb-1">{winRate}%</div>
          <div className="text-chinese-white/60 text-sm">胜率</div>
        </div>
      </div>

      {/* 对局记录 */}
      <div className="bg-gradient-to-br from-chinese-wood/30 to-chinese-black/50 p-6 rounded-lg border border-chinese-gold/20">
        <h3 className="text-xl font-serif text-chinese-gold font-bold mb-4">最近对局</h3>
        <div className="space-y-3">
          {totalGames === 0 ? (
            <div className="text-center py-8 text-chinese-white/50">
              暂无对局记录
            </div>
          ) : (
            <div className="text-chinese-white/80">
              共完成 {totalGames} 场对局
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/lobby')}
          className="flex-1 btn-chinese py-3"
        >
          开始对局
        </button>
        <button 
          onClick={handleLogout}
          className="flex-1 py-3 border border-chinese-red/50 text-chinese-red rounded hover:bg-chinese-red/20 transition-colors"
        >
          退出登录
        </button>
      </div>
    </div>
  )
}
