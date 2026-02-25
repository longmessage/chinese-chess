import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGameStore } from '../hooks/useGameStore'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useGameStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-chinese-black to-gray-900 cloud-pattern">
      {/* 顶部导航 */}
      <header className="bg-gradient-to-r from-chinese-red/90 to-red-900/90 border-b-2 border-chinese-gold shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-chinese-gold rounded-full flex items-center justify-center shadow-lg">
                <span className="text-chinese-black font-serif text-2xl font-bold">楚</span>
              </div>
              <div>
                <h1 className="text-2xl font-serif text-chinese-gold font-bold tracking-wider">楚汉棋魂</h1>
                <p className="text-xs text-chinese-white/70">中国象棋对战平台</p>
              </div>
            </Link>

            {/* 导航链接 */}
            <nav className="flex items-center space-x-6">
              <Link to="/lobby" className="text-chinese-white hover:text-chinese-gold font-medium transition-colors">
                大厅
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="text-chinese-white hover:text-chinese-gold font-medium transition-colors">
                    {user.username}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-chinese-white/70 hover:text-chinese-gold text-sm transition-colors"
                  >
                    退出
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-chinese-white hover:text-chinese-gold font-medium transition-colors">
                    登录
                  </Link>
                  <Link to="/register" className="btn-chinese text-sm">
                    注册
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* 底部 */}
      <footer className="border-t border-chinese-gold/30 bg-chinese-black/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <p className="text-chinese-white/50 text-sm">
            © 2026 楚汉棋魂 | 传承中华棋道文化
          </p>
        </div>
      </footer>
    </div>
  )
}
