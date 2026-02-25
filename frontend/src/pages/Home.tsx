import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameStore } from '../hooks/useGameStore'

export default function Home() {
  const { user } = useGameStore()

  return (
    <div className="space-y-12">
      {/* Hero 区域 */}
      <section className="text-center py-16 relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-chinese-gold/20 rounded-full" />
          <div className="absolute top-20 right-20 w-24 h-24 border-4 border-chinese-red/20 rounded-full" />
          <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-chinese-gold/10 rounded-lg rotate-45" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-serif text-chinese-gold font-bold mb-4 tracking-widest">
            楚汉棋魂
          </h1>
          <p className="text-xl text-chinese-white/80 mb-8 font-serif">
            传承千年棋道 · 对决古今豪杰
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex justify-center gap-6"
        >
          {user ? (
            <Link to="/lobby" className="btn-chinese text-lg px-10 py-4 animate-pulse-gold">
              进入大厅
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-chinese text-lg px-10 py-4">
                登录对战
              </Link>
              <Link to="/register" className="px-10 py-4 border-2 border-chinese-white/30 text-chinese-white hover:border-chinese-gold hover:text-chinese-gold rounded transition-all font-serif">
                注册账号
              </Link>
            </>
          )}
        </motion.div>
      </section>

      {/* 特色功能 */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: '⚔️',
            title: '实时对战',
            desc: '与全国棋友实时对决，支持悔棋、认输、求和'
          },
          {
            icon: '👁️',
            title: '观战系统',
            desc: '观战高手对局，学习进阶技巧'
          },
          {
            icon: '📖',
            title: '棋谱复盘',
            desc: '记录每一步，复盘分析提升棋力'
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.2 }}
            className="bg-gradient-to-br from-chinese-wood/30 to-chinese-black/50 p-8 rounded-lg border border-chinese-gold/20 hover:border-chinese-gold/50 transition-all"
          >
            <div className="text-5xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-serif text-chinese-gold font-bold mb-2">{item.title}</h3>
            <p className="text-chinese-white/70">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* 棋盘展示 */}
      <section className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="relative"
        >
          <div className="w-80 h-96 chess-board p-4">
            <div className="grid grid-rows-10 grid-cols-9 h-full gap-0">
              {[...Array(10)].map((_, row) => (
                [...Array(9)].map((_, col) => (
                  <div 
                    key={`${row}-${col}`}
                    className="border border-chinese-gold/30 flex items-center justify-center relative"
                  >
                    {/* 交叉点标记 */}
                    {(row === 3 || row === 6) && col > 0 && col < 8 && (
                      <div className="absolute w-2 h-2 bg-chinese-gold/50 rounded-full" />
                    )}
                  </div>
                ))
              ))}
            </div>
          </div>
          {/* 楚河汉界 */}
          <div className="absolute top-1/2 left-0 right-0 h-16 river -translate-y-1/2">
            <span className="river-text">楚河 汉界</span>
          </div>
        </motion.div>
      </section>

      {/* 统计数据 */}
      <section className="text-center py-8 border-t border-chinese-gold/20">
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-serif text-chinese-gold font-bold">10,000+</div>
            <div className="text-chinese-white/60 text-sm">注册用户</div>
          </div>
          <div>
            <div className="text-3xl font-serif text-chinese-gold font-bold">50,000+</div>
            <div className="text-chinese-white/60 text-sm">对局总数</div>
          </div>
          <div>
            <div className="text-3xl font-serif text-chinese-gold font-bold">99.9%</div>
            <div className="text-chinese-white/60 text-sm">在线率</div>
          </div>
        </div>
      </section>
    </div>
  )
}
