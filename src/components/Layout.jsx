import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'
import Sidebar from './Sidebar'

function Layout({ children, title }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('mes_user') || '{}')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-vh-100" style={{ background: '#f4f6fb' }}>

      {/* 사이드바 */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 네비게이션 바 */}
      <nav
        className="px-3 px-md-4"
        style={{
          background: '#1a2236',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 52,
          position: 'sticky', top: 0, zIndex: 1030,
        }}
      >
        {/* 왼쪽: 햄버거 + 로고 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* 햄버거 버튼 */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 7,
              width: 34, height: 34,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              gap: 5,
              padding: 0,
            }}
          >
            <span style={{ display: 'block', width: 18, height: 2, background: 'rgba(255,255,255,0.85)', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 18, height: 2, background: 'rgba(255,255,255,0.85)', borderRadius: 2 }} />
            <span style={{ display: 'block', width: 18, height: 2, background: 'rgba(255,255,255,0.85)', borderRadius: 2 }} />
          </button>

          {/* 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26, height: 26, background: '#4f8ef7',
              borderRadius: 6, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13,
            }}>M</div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 14, letterSpacing: '0.04em' }}>
              {title || 'MES SYSTEM'}
            </span>
          </div>
        </div>

        {/* 오른쪽: 사용자 + 로그아웃 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }} className="d-none d-md-inline">
            {user.userNm || user.userId || '사용자'}님
          </span>
          <button
            className="btn btn-outline-light btn-sm"
            style={{ fontSize: 12, padding: '3px 10px' }}
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </nav>

      {/* 페이지 콘텐츠 */}
      <div className="container-fluid px-3 px-md-4 py-4" style={{ maxWidth: 960 }}>
        {children}
      </div>
    </div>
  )
}

export default Layout
