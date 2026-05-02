import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/dashboard/Dashboard'
import ReceivingManage from './pages/receiving/ReceivingManage'
import ReceivingHistory from './pages/receiving/ReceivingHistory'
import ReleaseManage from './pages/release/ReleaseManage'
import ReleaseHistory from './pages/release/ReleaseHistory'
import ShipmentManage from './pages/shipment/ShipmentManage'
import ShipmentHistory from './pages/shipment/ShipmentHistory'

/**
 * JWT 토큰 유효성 검사 (존재 여부 + 만료 시간 클라이언트 체크)
 * 실제 서명 검증은 서버 authMiddleware에서 수행
 */
const isAuthenticated = () => {
  const token = localStorage.getItem('mes_token')
  if (!token) return false

  try {
    // JWT payload 디코딩 (Base64) → 만료 시간만 확인
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      // 만료된 토큰 자동 제거
      localStorage.removeItem('mes_token')
      localStorage.removeItem('mes_user')
      return false
    }
    return true
  } catch {
    // 파싱 실패 시 토큰 제거
    localStorage.removeItem('mes_token')
    localStorage.removeItem('mes_user')
    return false
  }
}

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        <Route path="/receiving" element={<PrivateRoute><ReceivingManage /></PrivateRoute>} />
        <Route path="/receiving-history" element={<PrivateRoute><ReceivingHistory /></PrivateRoute>} />

        <Route path="/release" element={<PrivateRoute><ReleaseManage /></PrivateRoute>} />
        <Route path="/release-history" element={<PrivateRoute><ReleaseHistory /></PrivateRoute>} />

        <Route path="/shipment" element={<PrivateRoute><ShipmentManage /></PrivateRoute>} />
        <Route path="/shipment-history" element={<PrivateRoute><ShipmentHistory /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
