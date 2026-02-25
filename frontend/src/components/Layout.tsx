import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGameStore } from '../hooks/useGameStore'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useGameStore()
  const navigate = useNavigate()
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // 默认音乐列表 - 使用免费古风音乐
  const musicList = [
    { name: '静心古琴', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { name: '流水高山', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { name: '渔舟唱晚', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ]
  const [currentMusic, setCurrentMusic] = useState(0)

  const nextMusic = () => {
    setCurrentMusic((currentMusic + 1) % musicList.length)
    setIsPlaying(true)
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = musicList[currentMusic].url
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentMusic])

  return (
    <div className="min-h-screen bg-gradient-to-br from-chinese-black to-gray-900 cloud-pattern">
      {/* 顶部导航 */}
      <header className="bg-gradient-to-r from-chinese-red/90 to-red-900/90 border-b-2 border-chinese-gold shadow-lg relative">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-chinese-gold rounded-full flex items-center justify-center shadow-lg">
                <span className="text-chinese-black font-serif text-xl font-bold">楚</span>
              </div>
              <div>
                <h1 className="text-xl font-serif text-chinese-gold font-bold tracking-wider">楚汉棋魂</h1>
                <p className="text-xs text-chinese-white/70">中国象棋对战平台</p>
              </div>
            </Link>

            {/* 导航链接 */}
            <nav className="flex items-center space-x-4">
              <Link to="/lobby" className="text-chinese-white hover:text-chinese-gold font-medium transition-colors text-sm md:text-base">
                大厅
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="text-chinese-white hover:text-chinese-gold font-medium transition-colors text-sm md:text-base">
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
                  <Link to="/login" className="text-chinese-white hover:text-chinese-gold font-medium transition-colors text-sm md:text-base">
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

        {/* 悬浮音乐播放器按钮 */}
        <div className="absolute top-0 right-4 md:right-60 -translate-y-1/2">
          <button
            onClick={() => setShowMusicPlayer(!showMusicPlayer)}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
              isPlaying 
                ? 'bg-chinese-gold animate-pulse' 
                : 'bg-chinese-red/80 border border-chinese-gold'
            }`}
            title="背景音乐"
          >
            <span className="text-lg">🎵</span>
          </button>
        </div>

        {/* 音乐播放器面板 */}
        {showMusicPlayer && (
          <div className="absolute top-full right-4 mt-2 w-64 bg-gradient-to-br from-chinese-wood/90 to-black/90 border border-chinese-gold/50 rounded-lg shadow-xl p-4 z-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-chinese-gold font-serif text-sm">🎵 古风音乐</span>
              <button
                onClick={() => setShowMusicPlayer(false)}
                className="text-chinese-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-3">
              <div className="text-white text-sm mb-1">{musicList[currentMusic].name}</div>
              <div className="text-chinese-white/50 text-xs">点击播放背景音乐</div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={toggleMusic}
                className="w-10 h-10 rounded-full bg-chinese-gold/20 text-chinese-gold border border-chinese-gold/50 hover:bg-chinese-gold/30 flex items-center justify-center"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button
                onClick={nextMusic}
                className="w-10 h-10 rounded-full bg-chinese-gold/20 text-chinese-gold border border-chinese-gold/50 hover:bg-chinese-gold/30 flex items-center justify-center"
              >
                ⏭️
              </button>
            </div>

            {/* 隐藏的 audio 元素 */}
            <audio
              ref={audioRef}
              loop
              onEnded={() => nextMusic()}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        )}
      </header>

      {/* 主内容 */}
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {children}
      </main>

      {/* 底部 */}
      <footer className="border-t border-chinese-gold/30 bg-chinese-black/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center">
          <p className="text-chinese-white/50 text-xs md:text-sm">
            © 2026 楚汉棋魂 | 传承中华棋道文化
          </p>
        </div>
      </footer>
    </div>
  )
}
