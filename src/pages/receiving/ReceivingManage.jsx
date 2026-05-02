import { useState } from 'react'
import Layout from '../../components/Layout'
import QrScanner from '../../components/QrScanner'
import { useReceivingManage } from './useReceivingManage'

function ReceivingManage() {
  const {
    showScanner, setShowScanner,
    scannedData, setScannedData,
    searchDate,  setSearchDate,
    searchItemCode, setSearchItemCode,
    filtered,
    statusLabel,
    handleScan,
    handleTestScan,
    handleConfirm,
    handleReset,
  } = useReceivingManage()

  return (
    <Layout title="입고관리">
      <div className="mb-4">
        <h5 className="fw-semibold mb-1">입고관리</h5>
        <small className="text-muted">자재 및 제품 입고 처리</small>
      </div>

      {/* 검색 영역 */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <div className="row g-2">
            <div className="col-6">
              <label className="form-label small text-muted mb-1">입고일자</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={searchDate}
                onChange={e => setSearchDate(e.target.value)}
              />
            </div>
            <div className="col-6">
              <label className="form-label small text-muted mb-1">품목코드</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="품목코드 입력"
                value={searchItemCode}
                onChange={e => setSearchItemCode(e.target.value)}
              />
            </div>
            <div className="col-12 d-flex gap-2 pt-1">
              <button className="btn btn-primary btn-sm flex-fill" style={{ background: '#4f8ef7', border: 'none' }}>
                조회
              </button>
              <button className="btn btn-outline-secondary btn-sm flex-fill" onClick={handleReset}>
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="d-flex gap-2 justify-content-end mb-3">
        <button
          className="btn btn-sm d-flex align-items-center gap-1"
          style={{ background: '#20c997', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}
          onClick={() => setShowScanner(true)}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <path d="M14 14h3v3m0 4h4m-4 0v-4m-3 4h-1m1-4h-1v-1"/>
          </svg>
          QR 스캔
        </button>

        <button
          className="btn btn-sm d-flex align-items-center gap-1"
          style={{ background: '#fd7e14', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}
          onClick={handleTestScan}
          title="실제 카메라 없이 테스트 데이터로 스캔"
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v3m0 16v3M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M1 12h3m16 0h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
          </svg>
          테스트 스캔
        </button>

        <button
          className="btn btn-sm"
          style={{ background: '#4f8ef7', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600 }}
          onClick={() => setScannedData({ itemCode: '', itemName: '', qty: 1, unit: 'EA', supplier: '', lotNo: '' })}
        >
          + 수동 등록
        </button>
      </div>

      {/* 목록 테이블 */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>입고번호</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>품목명</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>수량</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>LOT</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-5" style={{ fontSize: 13 }}>
                      조회된 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filtered.map(r => {
                    const st = statusLabel(r.status)
                    return (
                      <tr key={r.recvNo}>
                        <td className="px-3 py-2" style={{ fontSize: 11, color: '#888' }}>{r.recvNo}</td>
                        <td className="px-3 py-2 fw-semibold">
                          {r.itemName}
                          <div style={{ fontSize: 11, color: '#aaa' }}>{r.itemCode}</div>
                        </td>
                        <td className="px-3 py-2">{r.qty} {r.unit}</td>
                        <td className="px-3 py-2" style={{ fontSize: 11, color: '#888' }}>{r.lotNo}</td>
                        <td className="px-3 py-2">
                          <span className={`fw-semibold ${st.cls}`} style={{ fontSize: 12 }}>{st.text}</span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* QR 스캐너 오버레이 */}
      {showScanner && (
        <QrScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
      )}

      {/* 입고 등록 확인 모달 */}
      {scannedData && (
        <ReceivingConfirmModal
          data={scannedData}
          onConfirm={handleConfirm}
          onClose={() => setScannedData(null)}
        />
      )}
    </Layout>
  )
}

/* ── 입고 등록 확인 모달 (View 전용 서브 컴포넌트) ── */
function ReceivingConfirmModal({ data, onConfirm, onClose }) {
  const [form, setForm] = useState({
    itemCode: data.itemCode || '',
    itemName: data.itemName || '',
    qty:      data.qty ?? 1,
    unit:     data.unit || 'EA',
    supplier: data.supplier || '',
    lotNo:    data.lotNo || '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px 16px 0 0',
        width: '100%', maxWidth: 520,
        padding: '1.5rem 1.25rem 2rem',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.18)',
      }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <span style={{ background: '#20c997', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
              QR 스캔 완료
            </span>
            <span className="fw-semibold" style={{ fontSize: 16 }}>입고 등록</span>
          </div>
          <button className="btn-close" onClick={onClose} />
        </div>

        <div className="row g-2">
          <div className="col-6">
            <label className="form-label small text-muted mb-1">품목코드</label>
            <input className="form-control form-control-sm" value={form.itemCode} onChange={e => set('itemCode', e.target.value)} />
          </div>
          <div className="col-6">
            <label className="form-label small text-muted mb-1">단위</label>
            <select className="form-select form-select-sm" value={form.unit} onChange={e => set('unit', e.target.value)}>
              {['EA', 'PCS', 'KG', 'M', 'BOX', 'SET'].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label small text-muted mb-1">품목명</label>
            <input className="form-control form-control-sm" value={form.itemName} onChange={e => set('itemName', e.target.value)} />
          </div>
          <div className="col-6">
            <label className="form-label small text-muted mb-1">수량</label>
            <input type="number" className="form-control form-control-sm" value={form.qty} min={1} onChange={e => set('qty', Number(e.target.value))} />
          </div>
          <div className="col-6">
            <label className="form-label small text-muted mb-1">LOT No.</label>
            <input className="form-control form-control-sm" value={form.lotNo} onChange={e => set('lotNo', e.target.value)} />
          </div>
          <div className="col-12">
            <label className="form-label small text-muted mb-1">거래처</label>
            <input className="form-control form-control-sm" value={form.supplier} onChange={e => set('supplier', e.target.value)} />
          </div>
        </div>

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-outline-secondary btn-sm flex-fill" onClick={onClose}>취소</button>
          <button
            className="btn btn-sm flex-fill fw-semibold"
            style={{ background: '#4f8ef7', color: '#fff', border: 'none' }}
            onClick={() => onConfirm(form)}
          >
            입고 등록
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReceivingManage
