import { useState, useRef, useEffect } from 'react'

export default function MediaControls() {
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)

  const startMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      })
      setLocalStream(stream)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      setIsConnected(true)
    } catch (err) {
      console.error('Failed to get media:', err)
      alert('无法获取摄像头/麦克风权限，请检查浏览器设置')
    }
  }

  const stopMedia = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }
    setIsConnected(false)
  }

  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn
      })
      setIsAudioOn(!isAudioOn)
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn
      })
      setIsVideoOn(!isVideoOn)
    }
  }

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopMedia()
      await startMedia()
      setIsScreenSharing(false)
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        })
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream
        }
        setIsScreenSharing(true)
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false)
          startMedia()
        }
      } catch (err) {
        console.error('Screen share failed:', err)
      }
    }
  }

  useEffect(() => {
    return () => {
      stopMedia()
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        {isConnected ? (
          <>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">已连接</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-chinese-white/60">
            <div className="text-5xl mb-4">📹</div>
            <p>点击下方按钮开启视频</p>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        {!isConnected ? (
          <button
            onClick={startMedia}
            className="btn-chinese flex items-center gap-2"
          >
            <span>🎥</span> 开启视频
          </button>
        ) : (
          <>
            <button
              onClick={toggleAudio}
              className={`p-3 rounded-full transition-all ${
                isAudioOn 
                  ? 'bg-chinese-gold/20 text-chinese-gold border border-chinese-gold' 
                  : 'bg-red-600/20 text-red-500 border border-red-500'
              }`}
            >
              {isAudioOn ? '🎤' : '🔇'}
            </button>
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-all ${
                isVideoOn 
                  ? 'bg-chinese-gold/20 text-chinese-gold border border-chinese-gold' 
                  : 'bg-red-600/20 text-red-500 border border-red-500'
              }`}
            >
              {isVideoOn ? '📹' : '📷'}
            </button>
            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-full transition-all ${
                isScreenSharing 
                  ? 'bg-green-600/20 text-green-500 border border-green-500' 
                  : 'bg-chinese-gold/20 text-chinese-gold border border-chinese-gold'
              }`}
            >
              🖥️
            </button>
            <button
              onClick={stopMedia}
              className="p-3 rounded-full bg-red-600/20 text-red-500 border border-red-500 hover:bg-red-600/30"
            >
              📴
            </button>
          </>
        )}
      </div>

      <p className="text-center text-chinese-white/50 text-sm">
        {isConnected 
          ? '语音视频通话已开启，其他玩家可以看到你'
          : '开启语音视频与其他玩家互动'}
      </p>
    </div>
  )
}
