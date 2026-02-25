import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Danmaku {
  id: string
  text: string
  color: string
  username: string
}

interface DanmakuProps {
  
  username: string
  isVisible: boolean
}

const COLORS = [
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
  '#FF00FF', '#00FFFF', '#FFA500', '#C03027'
]

export default function Danmaku({ username, isVisible }: DanmakuProps) {
  const [messages, setMessages] = useState<Danmaku[]>([])
  const [inputText, setInputText] = useState('')
  const [isDanmakuOn, setIsDanmakuOn] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 模拟收到弹幕
  useEffect(() => {
    if (!isVisible || !isDanmakuOn) return

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomNames = ['棋王', '象棋爱好者', '观战用户', '小明', '大师', '新手']
        const randomMessages = [
          '好棋！👍', '这步妙啊', '加油！', '支持红方', 
          '黑方加油', '666', '学到了', '再来一局'
        ]
        
        const newDanmaku: Danmaku = {
          id: Date.now().toString(),
          text: randomMessages[Math.floor(Math.random() * randomMessages.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          username: randomNames[Math.floor(Math.random() * randomNames.length)]
        }
        
        setMessages(prev => [...prev.slice(-20), newDanmaku])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isVisible, isDanmakuOn])

  const sendDanmaku = () => {
    if (!inputText.trim()) return

    const newDanmaku: Danmaku = {
      id: Date.now().toString(),
      text: inputText.trim(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      username: username
    }

    setMessages(prev => [...prev.slice(-20), newDanmaku])
    setInputText('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendDanmaku()
    }
  }

  if (!isVisible) return null

  return (
    <div className="space-y-4">
      {/* 弹幕显示区域 */}
      <div 
        ref={containerRef}
        className="relative h-16 bg-black/30 rounded-lg overflow-hidden border border-chinese-gold/20"
      >
        <AnimatePresence>
          {messages.slice(-10).map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: '-100%', opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 8, ease: 'linear' }}
              className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap"
              style={{ color: msg.color, left: '100%' }}
            >
              <span className="text-sm font-bold">{msg.username}: </span>
              <span>{msg.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-chinese-white/30 text-sm">
            弹幕显示区域
          </div>
        )}
      </div>

      {/* 发送弹幕 */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="发送弹幕..."
          className="flex-1 bg-black/30 border border-chinese-gold/30 rounded-lg px-4 py-2 text-white placeholder:text-chinese-white/30"
          maxLength={20}
        />
        <button
          onClick={sendDanmaku}
          className="px-4 py-2 bg-chinese-red/20 text-chinese-red rounded-lg border border-chinese-red/50 hover:bg-chinese-red/30"
        >
          发送
        </button>
        <button
          onClick={() => setIsDanmakuOn(!isDanmakuOn)}
          className={`px-4 py-2 rounded-lg border ${
            isDanmakuOn 
              ? 'bg-chinese-gold/20 text-chinese-gold border-chinese-gold/50' 
              : 'bg-black/30 text-chinese-white/50 border-chinese-white/20'
          }`}
        >
          {isDanmakuOn ? '🎬' : '📴'}
        </button>
      </div>
    </div>
  )
}
