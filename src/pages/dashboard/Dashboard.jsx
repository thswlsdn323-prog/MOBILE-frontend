import Layout from '../../components/Layout'
import QrScanner from '../../components/QrScanner'
import { useDashboard } from './useDashboard'

/* ── 아이콘 모음 ───────────────────────────────────────── */
const Icons = {
  qr: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
      <path d="M14 14h3v3m0 4h4m-4 0v-4m-3 4h-1m1-4h-1v-1"/>
    </svg>
  ),
  prod: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M2 20h20M6 20V10l6-6 6 6v10M10 20v-5h4v5"/>
    </svg>
  ),
  equip: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93A10 10 0 1 0 4.93 19.07 10 10 0 0 0 19.07 4.93z"/>
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>
    </svg>
  ),
  quality: (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
}

function Dashboard() {
  const {
    user,
    showQr,
    qrResult,
    topCards,
    warehouseCards,
    summaryCards,
    handleQrScan,
    handleQrClose,
    handleQrResultClose,
    navigate,
  } = useDashboard()

  return (
    <Layout title="대시보드">
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
          <button className="btn-close btn-close-sm flex-shrink-0 mt-1" onClick={handleQrResultClose} />
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
                  {Icons[card.icon]}
                </div>
                <p className="fw-semibold mb-1 small">{card.label}</p>
                <p className="text-muted mb-0" style={{ fontSize: 11 }}>{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 창고관리 바로가기 */}
      <h6 className="fw-semibold mb-3 text-muted" style={{ fontSize: 13, letterSpacing: '0.05em' }}>
        창고관리 바로가기
      </h6>
      <div className="row g-2 mb-4">
        {warehouseCards.map((card) => (
          <div key={card.path} className="col-6 col-md-4">
            <div
              className="card border-0 shadow-sm"
              style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
              onClick={() => navigate(card.path)}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-3 d-flex align-items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: card.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{card.label}</span>
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

      {/* QR 스캐너 모달 */}
      {showQr && (
        <QrScanner onScan={handleQrScan} onClose={handleQrClose} />
      )}
    </Layout>
  )
}

export default Dashboard
