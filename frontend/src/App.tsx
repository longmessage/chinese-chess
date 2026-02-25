import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Lobby from './pages/Lobby'
import Room from './pages/Room'
import Profile from './pages/Profile'
import AIRoom from './pages/AIRoom'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai" element={<AIRoom />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
