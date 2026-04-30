import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'
import QrScanner from '../components/QrScanner'

function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('mes_user') || '{}')

  const [showQr, setShowQr] = useState(false)
  const [qrResult, setQrResult] = useState(null)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleQrScan = (result) => {
    setQrResult(result)
    setShowQr(false)
  }

  // 상단 카드 목록
  const topCards = [
    {
      id: 'qr',
      icon: (
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
          <path d="M14 14h3v3m0 4h4m-4 0v-4m-3 4h-1m1-4h-1v-1"/>
        </svg>
      ),
      label: 'QR 스캔',
      desc: '작업지시 / 자재 조회',
      color: '#4f8ef7',
      bg: '#eef4ff',
      action: () => setShowQr(true),
    },
    {
      id: 'prod',
      icon: (
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M2 20h20M6 20V10l6-6 6 6v10M10 20v-5h4v5"/>
        </svg>
      ),
      label: '생산 현황',
      desc: '실시간 생산 모니터링',
      color: '#20c997',
      bg: '#eafaf5',
      action: () => {},
    },
    {
      id: 'equip',
      icon: (
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.07 4.93A10 10 0 1 0 4.93 19.07 10 10 0 0 0 19.07 4.93z"/>
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
        </svg>
      ),
      label: '설비 상태',
      desc: '설비 가동 현황',
      color: '#fd7e14',
      bg: '#fff4e6',
      action: () => {},
    },
    {
      id: 'quality',
      icon: (
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      ),
      label: '품질 지표',
      desc: '불량률 / 검사 현황',
      color: '#e83e8c',
      bg: '#fdf0f7',
      action: () => {},
    },
  ]

  // 하단 요약 카드
  const summaryCards = [
    { label: '금일 생산량', value: '-', unit: 'EA' },
    { label: '가동률', value: '-', unit: '%' },
    { label: '불량률', value: '-', unit: '%' },
    { label: '작업지시', value: '-', unit: '건' },
  ]

  return (
    <div className="min-vh-100" style={{ background: '#f4f6fb' }}>

      {/* 네비게이션 바 */}
      <nav className="navbar px-3 px-md-4" style={{ background: '#1a2236' }}>
        <div className="d-flex align-items-center gap-2">
          <div style={{
            width: 28, height: 28, background: '#4f8ef7',
            borderRadius: 6, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 600, fontSize: 14,
          }}>M</div>
          <span className="text-white fw-semibold" style={{ letterSpacing: '0.04em' }}>MES SYSTEM</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="text-white-50 small d-none d-md-inline">
            {user.userNm || user.userId || '사용자'}님 환영합니다
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </nav>

      <div className="container-fluid px-3 px-md-4 py-4" style={{ maxWidth: 960 }}>

        {/* 인사말 */}
        <div className="mb-4">
          <h5 className="fw-semibold mb-1">
            안녕하세요, {user.userNm || user.userId}님 👋
          </h5>
          <small className="text-muted">오늘도 안전한 하루 되세요</small>
        </div>

        {/* QR 스캔 결과 알림 */}
        {qrResult && (
          <div className="alert alert-success d-flex align-items-start justify-content-between gap-2 mb-4 py-2">
            <div>
              <strong className="small">QR 인식 결과</strong>
              <div className="small mt-1" style={{ wordBreak: 'break-all' }}>{qrResult}</div>
            </div>
            <button
              className="btn-close btn-close-sm flex-shrink-0 mt-1"
              onClick={() => setQrResult(null)}
            />
          </div>
        )}

        {/* 상단 기능 카드 */}
        <div className="row g-3 mb-4">
          {topCards.map((card) => (
            <div key={card.id} className="col-6 col-md-3">
              <div
                className="card h-100 border-0 shadow-sm"
                style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onClick={card.action}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="card-body d-flex flex-column align-items-start p-3">
                  <div style={{
                    width: 52, height: 52,
                    background: card.bg,
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: card.color,
                    marginBottom: 12,
                  }}>
                    {card.icon}
                  </div>
                  <p className="fw-semibold mb-1 small">{card.label}</p>
                  <p className="text-muted mb-0" style={{ fontSize: 11 }}>{card.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 요약 카드 */}
        <h6 className="fw-semibold mb-3 text-muted" style={{ fontSize: 13, letterSpacing: '0.05em' }}>
          오늘의 현황
        </h6>
        <div className="row g-3">
          {summaryCards.map((card, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-3">
                  <p className="text-muted mb-1" style={{ fontSize: 12 }}>{card.label}</p>
                  <div className="d-flex align-items-baseline gap-1">
                    <span className="fw-semibold" style={{ fontSize: 24 }}>{card.value}</span>
                    <span className="text-muted small">{card.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* QR 스캐너 모달 */}
      {showQr && (
        <QrScanner
          onScan={handleQrScan}
          onClose={() => setShowQr(false)}
        />
      )}

    </div>
  )
}

export default Dashboard
