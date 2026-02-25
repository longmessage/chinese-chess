import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGameStore, User } from '../hooks/useGameStore'

type LoginMethod = 'password' | 'phone' | 'wechat' | 'qq'

export default function Login() {
  const [method, setMethod] = useState<LoginMethod>('password')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const { setUser } = useGameStore()
  const navigate = useNavigate()

  const sendCode = () => {
    if (phone.length !== 11) {
      setError('请输入正确的手机号')
      return
    }
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    // 模拟发送验证码
    alert(`验证码已发送到 ${phone.slice(0,3)}****${phone.slice(-4)}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      let mockUser: User
      
      if (method === 'password') {
        if (username && password) {
          mockUser = {
            id: Date.now().toString(),
            username,
            email: `${username}@example.com`,
            level: Math.floor(Math.random() * 10) + 1,
            wins: Math.floor(Math.random() * 100),
            losses: Math.floor(Math.random() * 50),
            draws: Math.floor(Math.random() * 20)
          }
        } else {
          setError('请填写用户名和密码')
          setLoading(false)
          return
        }
      } else if (method === 'phone') {
        if (phone && code) {
          mockUser = {
            id: Date.now().toString(),
            username: `用户${phone.slice(-4)}`,
            email: '',
            phone,
            level: 1,
            wins: 0,
            losses: 0,
            draws: 0
          }
        } else {
          setError('请填写手机号和验证码')
          setLoading(false)
          return
        }
      } else {
        // 微信/QQ 模拟登录
        mockUser = {
          id: Date.now().toString(),
          username: method === 'wechat' ? '微信用户' : 'QQ用户',
          email: '',
          level: 1,
          wins: 0,
          losses: 0,
          draws: 0
        }
      }
      
      setUser(mockUser)
      navigate('/lobby')
      setLoading(false)
    }, 1000)
  }



  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gradient-to-br from-chinese-wood/30 to-chinese-black/50 p-8 rounded-lg border border-chinese-gold/20">
        <h2 className="text-3xl font-serif text-chinese-gold font-bold text-center mb-8">
          用户登录
        </h2>

        {/* 登录方式切换 */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            { key: 'password', label: '密码', icon: '🔐' },
            { key: 'phone', label: '手机', icon: '📱' },
            { key: 'wechat', label: '微信', icon: '💬' },
            { key: 'qq', label: 'QQ', icon: '🐧' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setMethod(item.key as LoginMethod)}
              className={`px-4 py-2 rounded-lg flex items-center gap-1 transition-all ${
                method === item.key 
                  ? 'bg-chinese-gold/20 text-chinese-gold border border-chinese-gold' 
                  : 'bg-black/30 text-chinese-white/60 border border-transparent hover:border-chinese-gold/30'
              }`}
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {method === 'password' && (
            <>
              <div>
                <label className="block text-chinese-white/80 mb-2">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-chinese w-full"
                  placeholder="请输入用户名"
                />
              </div>
              <div>
                <label className="block text-chinese-white/80 mb-2">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-chinese w-full"
                  placeholder="请输入密码"
                />
              </div>
            </>
          )}

          {method === 'phone' && (
            <>
              <div>
                <label className="block text-chinese-white/80 mb-2">手机号</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={11}
                  className="input-chinese w-full"
                  placeholder="请输入手机号"
                />
              </div>
              <div>
                <label className="block text-chinese-white/80 mb-2">验证码</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    className="input-chinese flex-1"
                    placeholder="请输入验证码"
                  />
                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={countdown > 0}
                    className="px-4 py-2 bg-chinese-gold/20 text-chinese-gold rounded border border-chinese-gold/50 hover:bg-chinese-gold/30 disabled:opacity-50"
                  >
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </button>
                </div>
              </div>
            </>
          )}

          {method === 'wechat' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-chinese-white/60 mb-4">微信扫码登录</p>
              <p className="text-chinese-white/40 text-sm mb-4">（扫码功能开发中，请先使用其他方式登录）</p>
              <button
                type="button"
                onClick={() => {
                  const mockUser: User = {
                    id: Date.now().toString(),
                    username: '微信用户_' + Math.floor(Math.random() * 1000),
                    email: '',
                    level: 1,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    loginMethod: 'wechat'
                  }
                  setUser(mockUser)
                  navigate('/lobby')
                }}
                className="btn-chinese"
              >
                模拟微信登录
              </button>
            </div>
          )}

          {method === 'qq' && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🐧</div>
              <p className="text-chinese-white/60 mb-4">QQ登录</p>
              <p className="text-chinese-white/40 text-sm mb-4">（扫码功能开发中，请先使用其他方式登录）</p>
              <button
                type="button"
                onClick={() => {
                  const mockUser: User = {
                    id: Date.now().toString(),
                    username: 'QQ用户_' + Math.floor(Math.random() * 1000),
                    email: '',
                    level: 1,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    loginMethod: 'qq'
                  }
                  setUser(mockUser)
                  navigate('/lobby')
                }}
                className="btn-chinese"
              >
                模拟QQ登录
              </button>
            </div>
          )}

          {error && (
            <div className="text-chinese-red text-sm text-center">{error}</div>
          )}

          {(method === 'password' || method === 'phone') && (
            <button
              type="submit"
              disabled={loading}
              className="btn-chinese w-full py-3 disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          )}
        </form>

        <div className="mt-6 text-center">
          <span className="text-chinese-white/60">还没有账号？</span>
          <Link to="/register" className="text-chinese-gold hover:underline ml-2">
            立即注册
          </Link>
        </div>
      </div>
    </div>
  )
}
