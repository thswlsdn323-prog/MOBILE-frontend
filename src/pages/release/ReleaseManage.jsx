import Layout from '../../components/Layout'
import { useReleaseManage } from './useReleaseManage'

function ReleaseManage() {
  const {
    searchDate, setSearchDate,
    searchItemCode, setSearchItemCode,
    filtered,
    handleReset,
    handleSearch,
  } = useReleaseManage()

  return (
    <Layout title="출고관리">
      <div className="mb-4">
        <h5 className="fw-semibold mb-1">출고관리</h5>
        <small className="text-muted">자재 및 제품 출고 처리</small>
      </div>

      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <div className="row g-2">
            <div className="col-6">
              <label className="form-label small text-muted mb-1">출고일자</label>
              <input type="date" className="form-control form-control-sm" value={searchDate} onChange={e => setSearchDate(e.target.value)} />
            </div>
            <div className="col-6">
              <label className="form-label small text-muted mb-1">품목코드</label>
              <input type="text" className="form-control form-control-sm" placeholder="품목코드 입력" value={searchItemCode} onChange={e => setSearchItemCode(e.target.value)} />
            </div>
            <div className="col-12 d-flex gap-2 pt-1">
              <button className="btn btn-sm flex-fill" style={{ background: '#20c997', color: '#fff', border: 'none' }} onClick={handleSearch}>조회</button>
              <button className="btn btn-outline-secondary btn-sm flex-fill" onClick={handleReset}>초기화</button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-sm" style={{ background: '#20c997', color: '#fff', border: 'none', borderRadius: 8 }}>+ 출고 등록</button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0" style={{ fontSize: 13 }}>
              <thead style={{ background: '#f8f9fa' }}>
                <tr>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>출고번호</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>출고일자</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>품목명</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>수량</th>
                  <th className="px-3 py-2 text-muted fw-semibold" style={{ fontSize: 12 }}>상태</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center text-muted py-5" style={{ fontSize: 13 }}>조회된 데이터가 없습니다.</td></tr>
                ) : (
                  filtered.map(r => (
                    <tr key={r.releaseNo}>
                      <td className="px-3 py-2">{r.releaseNo}</td>
                      <td className="px-3 py-2">{r.releaseDate}</td>
                      <td className="px-3 py-2">{r.itemName}</td>
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

export default ReleaseManage
