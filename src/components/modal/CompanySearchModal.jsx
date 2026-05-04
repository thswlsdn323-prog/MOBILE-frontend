import { useState, useEffect, useRef } from 'react'

// ※ 실제 사용 시 아래 mockCompanies를 API 호출로 교체하세요
//    예) const res = await api.get('/api/companies')
const mockCompanies = [
  { companyCode: 'C001', companyName: '(주)한국제조' },
  { companyCode: 'C002', companyName: '(주)스마트팩토리' },
  { companyCode: 'C003', companyName: '(주)테크메이커' },
  { companyCode: 'C004', companyName: '(주)글로벌MES' },
  { companyCode: 'C005', companyName: '(주)신한산업' },
]

function CompanySearchModal({ show, onClose, onSelect }) {
  const [keyword, setKeyword] = useState('')
  const [list, setList] = useState(mockCompanies)
  const searchRef = useRef(null)

  useEffect(() => {
    if (show) {
      setKeyword('')
      setList(mockCompanies)
      // 팝업 열릴 때 검색창 자동 포커스
      setTimeout(() => searchRef.current?.focus(), 100)
    }
  }, [show])

  const handleSearch = (e) => {
    const val = e.target.value
    setKeyword(val)
    const filtered = mockCompanies.filter(
      (c) =>
        c.companyCode.toLowerCase().includes(val.toLowerCase()) ||
        c.companyName.includes(val)
    )
    setList(filtered)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose()
  }

  const handleSelect = (company) => {
    onSelect(company)
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
              <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
            </svg>
            <span className="search-modal-title">회사 선택</span>
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
              placeholder="회사코드 또는 회사명 검색"
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
                <th style={{ width: '110px' }}>회사코드</th>
                <th>회사명</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center text-muted py-4">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                list.map((c) => (
                  <tr
                    key={c.companyCode}
                    className="search-modal-row"
                    onClick={() => handleSelect(c)}
                  >
                    <td>
                      <span className="badge-code">{c.companyCode}</span>
                    </td>
                    <td>{c.companyName}</td>
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

export default CompanySearchModal
