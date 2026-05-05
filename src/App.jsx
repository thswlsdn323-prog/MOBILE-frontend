import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
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
  const token = localStorage.getItem('mes_access_token')
  const refreshToken = localStorage.getItem('mes_refresh_token')

  // refresh token이 없으면 완전 미인증
  if (!refreshToken) return false
  // access token이 없어도 refresh token이 있으면 api.js 인터셉터가 갱신 처리
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      // access token 만료 → 제거 후 refresh 흐름에 맡김
      localStorage.removeItem('mes_access_token')
    }
    return true
  } catch {
    localStorage.removeItem('mes_access_token')
    return !!localStorage.getItem('mes_refresh_token')
  }
}

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AppProvider>
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
    </AppProvider>
  )
}

export default App
