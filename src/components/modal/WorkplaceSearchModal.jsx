import { useState, useEffect, useRef } from 'react'

// ※ 실제 사용 시 아래 mockWorkplaces를 API 호출로 교체하세요
//    예) const res = await api.get(`/api/companies/${companyCode}/workplaces`)
const mockWorkplaces = {
  C001: [
    { workplaceCode: 'P001', workplaceName: '서울 본사 사업장' },
    { workplaceCode: 'P002', workplaceName: '인천 제1공장' },
    { workplaceCode: 'P003', workplaceName: '부산 남부 사업장' },
  ],
  C002: [
    { workplaceCode: 'P001', workplaceName: '판교 사업장' },
    { workplaceCode: 'P002', workplaceName: '수원 공장' },
  ],
  C003: [
    { workplaceCode: 'P001', workplaceName: '대전 R&D 사업장' },
    { workplaceCode: 'P002', workplaceName: '천안 제조 공장' },
    { workplaceCode: 'P003', workplaceName: '구미 생산 사업장' },
  ],
  C004: [
    { workplaceCode: 'P001', workplaceName: '강남 본사' },
    { workplaceCode: 'P002', workplaceName: '평택 물류센터' },
  ],
  C005: [
    { workplaceCode: 'P001', workplaceName: '울산 공장' },
    { workplaceCode: 'P002', workplaceName: '창원 사업장' },
    { workplaceCode: 'P003', workplaceName: '여수 사업장' },
  ],
}

function WorkplaceSearchModal({ show, onClose, onSelect, company }) {
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState([])
  const searchRef = useRef(null)

  useEffect(() => {
    if (show && company) {
      setKeyword('')
      const workplaces = mockWorkplaces[company.companyCode] || []
      setList(workplaces)
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [show, company])

  const handleSearch = (e) => {
    const val = e.target.value
    setKeyword(val)
    const base = mockWorkplaces[company?.companyCode] || []
    const filtered = base.filter(
      (w) =>
        w.workplaceCode.toLowerCase().includes(val.toLowerCase()) ||
        w.workplaceName.includes(val)
    )
    setList(filtered)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
  }

  const handleSelect = (workplace) => {
    onSelect(workplace)
    onClose()
  }

  if (!show) return null

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div
        className="search-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* 헤더 */}
        <div className="search-modal-header">
          <div className="d-flex align-items-center gap-2">
            <svg width="18" height="18" fill="#4f8ef7" viewBox="0 0 16 16">
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5z"/>
            </svg>
            <span className="search-modal-title">사업장 선택</span>
            {company && (
              <span className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: '0.72rem' }}>
                {company.companyName}
              </span>
            )}
          </div>
          <button className="search-modal-close" onClick={onClose}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </button>
        </div>

        {/* 검색창 */}
        <div className="search-modal-search">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <svg width="14" height="14" fill="#999" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
              </svg>
            </span>
            <input
              ref={searchRef}
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="사업장코드 또는 사업장명 검색"
              value={keyword}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* 목록 */}
        <div className="search-modal-body">
          <table className="search-modal-table">
            <thead>
              <tr>
                <th style={{ width: '110px' }}>사업장코드</th>
                <th>사업장명</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center text-muted py-4">
                    {company
                      ? '해당 회사에 등록된 사업장이 없습니다.'
                      : '회사를 먼저 선택해주세요.'}
                  </td>
                </tr>
              ) : (
                list.map((w) => (
                  <tr
                    key={w.workplaceCode}
                    className="search-modal-row"
                    onClick={() => handleSelect(w)}
                  >
                    <td>
                      <span className="badge-code">{w.workplaceCode}</span>
                    </td>
                    <td>{w.workplaceName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 푸터 */}
        <div className="search-modal-footer">
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>
            총 {list.length}건
          </span>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkplaceSearchModal
