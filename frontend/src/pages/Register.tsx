import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGameStore, User } from '../hooks/useGameStore'

type RegisterMethod = 'password' | 'phone'

export default function Register() {
  const [method, setMethod] = useState<RegisterMethod>('password')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
    alert(`验证码已发送到 ${phone.slice(0,3)}****${phone.slice(-4)}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (method === 'password') {
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致')
        return
      }
      if (password.length < 6) {
        setError('密码长度至少6位')
        return
      }
    } else {
      if (phone.length !== 11) {
        setError('请输入正确的手机号')
        return
      }
      if (code.length !== 6) {
        setError('请输入6位验证码')
        return
      }
    }

    setLoading(true)

    setTimeout(() => {
      const mockUser: User = {
        id: Date.now().toString(),
        username: method === 'password' ? username : `用户${phone.slice(-4)}`,
        email: method === 'password' ? email : undefined,
        phone: method === 'phone' ? phone : undefined,
        level: 1,
        wins: 0,
        losses: 0,
        draws: 0,
        loginMethod: method
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
          用户注册
        </h2>

        {/* 注册方式切换 */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setMethod('password')}
            className={`px-6 py-2 rounded-lg transition-all ${
              method === 'password' 
                ? 'bg-chinese-gold/20 text-chinese-gold border border-chinese-gold' 
                : 'bg-black/30 text-chinese-white/60 border border-transparent'
            }`}
          >
            邮箱注册
          </button>
          <button
            onClick={() => setMethod('phone')}
            className={`px-6 py-2 rounded-lg transition-all ${
              method === 'phone' 
                ? 'bg-chinese-gold/20 text-chinese-gold border border-chinese-gold' 
                : 'bg-black/30 text-chinese-white/60 border border-transparent'
            }`}
          >
            手机号注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {method === 'password' ? (
            <>
              <div>
                <label className="block text-chinese-white/80 mb-2">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-chinese w-full"
                  placeholder="请输入用户名"
                  required
                />
              </div>
              <div>
                <label className="block text-chinese-white/80 mb-2">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-chinese w-full"
                  placeholder="请输入邮箱"
                  required
                />
              </div>
              <div>
                <label className="block text-chinese-white/80 mb-2">密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-chinese w-full"
                  placeholder="请输入密码（至少6位）"
                  required
                />
              </div>
              <div>
                <label className="block text-chinese-white/80 mb-2">确认密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-chinese w-full"
                  placeholder="请再次输入密码"
                  required
                />
              </div>
            </>
          ) : (
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
                  required
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
                    required
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
              <div>
                <label className="block text-chinese-white/80 mb-2">设置密码</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-chinese w-full"
                  placeholder="请设置密码（至少6位）"
                  required
                />
              </div>
            </>
          )}

          {error && (
            <div className="text-chinese-red text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-chinese w-full py-3 disabled:opacity-50"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-chinese-white/60">已有账号？</span>
          <Link to="/login" className="text-chinese-gold hover:underline ml-2">
            立即登录
          </Link>
        </div>

        {/* 第三方登录 */}
        <div className="mt-8 pt-6 border-t border-chinese-gold/20">
          <p className="text-chinese-white/60 text-center mb-4">其他登录方式</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-6 py-2 bg-green-600/20 text-green-400 rounded-lg border border-green-500/50 hover:bg-green-600/30"
            >
              <span>💬</span> 微信
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/50 hover:bg-blue-600/30"
            >
              <span>🐧</span> QQ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
