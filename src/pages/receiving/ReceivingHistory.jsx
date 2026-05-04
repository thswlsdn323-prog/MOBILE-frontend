import Layout from '../../components/Layout'
import { useReceivingHistory } from './useReceivingHistory'

function ReceivingHistory() {
  const {
    SDATE,        setStartDate,
    EDATE,        setEndDate,
    ITEM_CD,      setItemCode,
    ITEM_NM,      setItemName,
    ITEM_DC,      setSpec,
    statusFilter, setStatusFilter,
    dataList,
    counts,
    isLoading,
    error,
    handleSearch,
    handleReset,
  } = useReceivingHistory()

  return (
    <Layout title="입고내역조회">
      <div className="mb-4">
        <h5 className="fw-semibold mb-1">입고내역조회</h5>
        <small className="text-muted">입고 처리 내역 조회</small>
      </div>

      {/* 검색 영역 */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body p-3">
          <div className="row g-2">

            {/* 입고일자 From */}
            <div className="col-6">
              <label className="form-label small text-muted mb-1">입고일 (시작)</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={SDATE}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>

            {/* 입고일자 To */}
            <div className="col-6">
              <label className="form-label small text-muted mb-1">입고일 (종료)</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={EDATE}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>

            {/* 품번 */}
            <div className="col-6">
              <label className="form-label small text-muted mb-1">품번</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="품번 입력"
                value={ITEM_CD}
                onChange={e => setItemCode(e.target.value)}
              />
            </div>

            {/* 입고상태 */}
            <div className="col-6">
              <label className="form-label small text-muted mb-1">입고상태</label>
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">전체</option>
                <option value="C">완료</option>
                <option value="P">처리중</option>
                <option value="X">취소</option>
              </select>
            </div>

            {/* 품명 */}
            <div className="col-6">
              <label className="form-label small text-muted mb-1">품명</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="품명 입력"
                value={ITEM_NM}
                onChange={e => setItemName(e.target.value)}
              />
            </div>

            {/* 규격 */}
            <div className="col-6">
              <label className="form-label small text-muted mb-1">규격</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="규격 입력"
                value={ITEM_DC}
                onChange={e => setSpec(e.target.value)}
              />
            </div>

            {/* 조회 / 초기화 버튼 */}
            <div className="col-12 d-flex gap-2 pt-1">
              <button
                className="btn btn-sm flex-fill"
                style={{ background: '#4f8ef7', color: '#fff', border: 'none' }}
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="d-flex align-items-center justify-content-center gap-1">
                    <span className="spinner-border spinner-border-sm" role="status" />
                    조회 중...
                  </span>
                ) : '조회'}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm flex-fill"
                onClick={handleReset}
                disabled={isLoading}
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="alert alert-danger py-2 small mb-3 d-flex align-items-center gap-2">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
          </svg>
          {error}
        </div>
      )}

      {/* 요약 뱃지 */}
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

      {/* 목록 카드 */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: 28, height: 28 }} role="status" />
          <div className="text-muted small mt-2">데이터를 불러오는 중...</div>
        </div>
      ) : dataList.length === 0 ? (
        <div className="text-center text-muted py-5" style={{ fontSize: 13 }}>
          조회된 데이터가 없습니다.
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {dataList.map((r, idx) => {
            const stColor =
              r.status === 'C' ? '#20c997' :
              r.status === 'P' ? '#4f8ef7' : '#dc3545'
            const stBg =
              r.status === 'C' ? '#e8faf5' :
              r.status === 'P' ? '#eaf1fe' : '#fdecea'
            const stText =
              r.status === 'C' ? '완료' :
              r.status === 'P' ? '처리중' : '취소'

            return (
              <div
                key={`${r.GR_NO}-${r.GR_SQ}-${idx}`}
                className="card border-0 shadow-sm"
                style={{ borderRadius: 10 }}
              >
                <div className="card-body px-3 py-2">

                  {/* ── 1행: 입고번호 / 입고일자 / 상태 ── */}
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>
                      {r.GR_NO}
                      {r.GR_SQ && (
                        <span style={{ color: '#bbb' }}> -{r.GR_SQ}</span>
                      )}
                    </span>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: 12, color: '#999' }}>{r.GR_DT}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: stColor,
                          background: stBg,
                          borderRadius: 20,
                          padding: '2px 8px',
                        }}
                      >
                        {stText}
                      </span>
                    </div>
                  </div>

                  {/* ── 2행: 품명·품번·규격 / 수량 ── */}
                  <div className="d-flex align-items-start justify-content-between">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* 품명 */}
                      <div
                        className="fw-semibold text-truncate"
                        style={{ fontSize: 14, color: '#222' }}
                      >
                        {r.ITEM_NM}
                      </div>
                      {/* 품번 · 규격 */}
                      <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>
                        {r.ITEM_CD}
                        {r.ITEM_DC && <span style={{ margin: '0 5px', color: '#ddd' }}>|</span>}
                        {r.ITEM_DC && <span>{r.ITEM_DC}</span>}
                      </div>
                      {/* LOT · 창고 / 장소 */}
                      <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>
                        {r.LOT_NB && (
                          <span><span style={{ color: '#ccc' }}>LOT</span> {r.LOT_NB}</span>
                        )}
                        {r.LOT_NB && (r.WH_NM || r.LC_NM) && (
                          <span style={{ margin: '0 5px', color: '#ddd' }}>·</span>
                        )}
                        {(r.WH_NM || r.LC_NM) && (
                          <span>{r.WH_NM}{r.LC_NM ? ` / ${r.LC_NM}` : ''}</span>
                        )}
                      </div>
                    </div>

                    {/* 수량 */}
                    <div className="text-end ms-3" style={{ flexShrink: 0 }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: '#333' }}>
                        {Number(r.QTY).toLocaleString()}
                      </span>
                      <span style={{ fontSize: 11, color: '#aaa', marginLeft: 3 }}>
                        {r.ITEM_UNIT ?? ''}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}

export default ReceivingHistory
