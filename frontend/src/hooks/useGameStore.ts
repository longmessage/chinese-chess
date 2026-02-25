import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  username: string
  email?: string
  phone?: string
  avatar?: string
  level: number
  wins: number
  losses: number
  draws: number
  loginMethod?: 'password' | 'phone' | 'wechat' | 'qq'
}

export interface Room {
  id: string
  name: string
  player1?: User
  player2?: User
  status: 'waiting' | 'playing' | 'finished'
  spectators: number
}

export interface ChessPiece {
  type: '帅' | '仕' | '相' | '车' | '马' | '炮' | '兵' | 
        '将' | '士' | '象' | '车' | '马' | '炮' | '卒'
  side: 'red' | 'black'
}

export interface Move {
  from: { row: number; col: number }
  to: { row: number; col: number }
  piece: ChessPiece
  captured?: ChessPiece
  notation: string
}

interface GameState {
  // User
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  
  // Rooms
  rooms: Room[]
  setRooms: (rooms: Room[]) => void
  addRoom: (room: Room) => void
  updateRoom: (roomId: string, updates: Partial<Room>) => void
  
  // Current Game
  currentRoom: Room | null
  setCurrentRoom: (room: Room | null) => void
  board: (ChessPiece | null)[][]
  setBoard: (board: (ChessPiece | null)[][]) => void
  currentTurn: 'red' | 'black'
  setCurrentTurn: (turn: 'red' | 'black') => void
  selectedPiece: { row: number; col: number } | null
  setSelectedPiece: (pos: { row: number; col: number } | null) => void
  moves: Move[]
  addMove: (move: Move) => void
  setMoves: (moves: Move[]) => void
  clearMoves: () => void
  redTime: number
  blackTime: number
  setRedTime: (time: number) => void
  setBlackTime: (time: number) => void
  
  // Game Status
  isMyTurn: boolean
  setIsMyTurn: (isMyTurn: boolean) => void
  mySide: 'red' | 'black' | null
  setMySide: (side: 'red' | 'black' | null) => void
}

const initialBoard: (ChessPiece | null)[][] = [
  // 0     1     2     3     4     5     6     7     8
  [null, null, null, null, null, null, null, null, null], // 0
  [{ type: '车', side: 'black' }, { type: '马', side: 'black' }, { type: '相', side: 'black' }, { type: '士', side: 'black' }, { type: '将', side: 'black' }, { type: '士', side: 'black' }, { type: '象', side: 'black' }, { type: '马', side: 'black' }, { type: '车', side: 'black' }], // 1
  [null, null, null, null, null, null, null, null, null], // 2
  [{ type: '炮', side: 'black' }, null, { type: '炮', side: 'black' }, null, null, null, { type: '炮', side: 'black' }, null, { type: '炮', side: 'black' }], // 3
  [{ type: '卒', side: 'black' }, null, { type: '卒', side: 'black' }, null, { type: '卒', side: 'black' }, null, { type: '卒', side: 'black' }, null, { type: '卒', side: 'black' }], // 4
  [null, null, null, null, null, null, null, null, null], // 5 (river)
  [{ type: '炮', side: 'red' }, null, { type: '炮', side: 'red' }, null, null, null, { type: '炮', side: 'red' }, null, { type: '炮', side: 'red' }], // 6
  [{ type: '兵', side: 'red' }, null, { type: '兵', side: 'red' }, null, { type: '兵', side: 'red' }, null, { type: '兵', side: 'red' }, null, { type: '兵', side: 'red' }], // 7
  [{ type: '车', side: 'red' }, { type: '马', side: 'red' }, { type: '相', side: 'red' }, { type: '仕', side: 'red' }, { type: '帅', side: 'red' }, { type: '仕', side: 'red' }, { type: '象', side: 'red' }, { type: '马', side: 'red' }, { type: '车', side: 'red' }], // 8
  [null, null, null, null, null, null, null, null, null], // 9
]

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      
      // Rooms
      rooms: [],
      setRooms: (rooms) => set({ rooms }),
      addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
      updateRoom: (roomId, updates) => set((state) => ({
        rooms: state.rooms.map(r => r.id === roomId ? { ...r, ...updates } : r)
      })),
      
      // Current Game
      currentRoom: null,
      setCurrentRoom: (room) => set({ currentRoom: room }),
      board: initialBoard,
      setBoard: (board) => set({ board }),
      currentTurn: 'red',
      setCurrentTurn: (turn) => set({ currentTurn: turn }),
      selectedPiece: null,
      setSelectedPiece: (pos) => set({ selectedPiece: pos }),
      moves: [],
      addMove: (move) => set((state) => ({ moves: [...state.moves, move] })),
      setMoves: (moves) => set({ moves }),
      clearMoves: () => set({ moves: [] }),
      redTime: 600,
      blackTime: 600,
      setRedTime: (time) => set({ redTime: time }),
      setBlackTime: (time) => set({ blackTime: time }),
      
      // Game Status
      isMyTurn: false,
      setIsMyTurn: (isMyTurn) => set({ isMyTurn }),
      mySide: null,
      setMySide: (side) => set({ mySide: side }),
    }),
    {
      name: 'chinese-chess-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
