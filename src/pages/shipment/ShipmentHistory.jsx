import Layout from '../../components/Layout'
import { useShipmentHistory } from './useShipmentHistory'

function ShipmentHistory() {
  const {
    startDate, setStartDate,
    endDate, setEndDate,
    supplier, setSupplier,
    statusFilter, setStatusFilter,
    dataList,
    counts,
    handleReset,
    handleSearch,
  } = useShipmentHistory()

  return (
    <Layout title="출하내역조회">
      <div className="mb-4">
        <h5 className="fw-semibold mb-1">출하내역조회</h5>
        <small className="text-muted">출하 처리 내역 조회</small>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <div className="row g-2">
            <div className="col-6">
              <label className="form-label small text-muted mb-1">시작일</label>
              <input type="date" className="form-control form-control-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small text-muted mb-1">종료일</label>
              <input type="date" className="form-control form-control-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small text-muted mb-1">거래처</label>
              <input type="text" className="form-control form-control-sm" placeholder="거래처" value={supplier} onChange={e => setSupplier(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small text-muted mb-1">출하상태</label>
              <select className="form-select form-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">전체</option>
                <option value="C">완료</option>
                <option value="P">처리중</option>
                <option value="X">취소</option>
              </select>
            </div>
            <div className="col-12 d-flex gap-2 pt-1">
              <button className="btn btn-sm flex-fill" style={{ background: '#fd7e14', color: '#fff', border: 'none' }} onClick={handleSearch}>조회</button>
              <button className="btn btn-outline-secondary btn-sm flex-fill" onClick={handleReset}>초기화</button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3">
        {[
          { label: '전체',   value: counts.total,    color: '#6c757d' },
          { label: '완료',   value: counts.complete,  color: '#20c997' },
          { label: '처리중', value: counts.progress,  color: '#4f8ef7' },
          { label: '취소',   value: counts.cancel,    color: '#dc3545' },
        ].map(b => (
          <div key={b.label} className="card border-0 shadow-sm flex-fill text-center py-2">
            <div style={{ fontSize: 11, color: '#aaa' }}>{b.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: b.color }}>{b.value}</div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>출하번호</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>출하일자</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>거래처</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>수량</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {dataList.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-muted py-5" style={{ fontSize: 13 }}>조회된 데이터가 없습니다.</td></tr>
                ) : (
                  dataList.map(r => (
                    <tr key={r.shipNo}>
                      <td className="px-3 py-2">{r.shipNo}</td>
                      <td className="px-3 py-2">{r.shipDate}</td>
                      <td className="px-3 py-2">{r.supplier}</td>
                      <td className="px-3 py-2">{r.qty}</td>
                      <td className="px-3 py-2">{r.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ShipmentHistory
