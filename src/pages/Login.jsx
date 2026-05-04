import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/authService'
import { useAppContext } from '../context/AppContext'
import CompanySearchModal from '../components/modal/CompanySearchModal'
import WorkplaceSearchModal from '../components/modal/WorkplaceSearchModal'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const { setSession } = useAppContext()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 회사 / 사업장
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedWorkplace, setSelectedWorkplace] = useState(null)
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [showWorkplaceModal, setShowWorkplaceModal] = useState(false)

  // 저장된 아이디 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('mes_uid')
    if (saved) {
      setUserId(saved)
      setRemember(true)
    }
    // 저장된 회사/사업장 복원
    const savedCompany = localStorage.getItem('mes_company')
    const savedWorkplace = localStorage.getItem('mes_workplace')
    if (savedCompany) setSelectedCompany(JSON.parse(savedCompany))
    if (savedWorkplace) setSelectedWorkplace(JSON.parse(savedWorkplace))
  }, [])

  // 회사가 바뀌면 사업장 초기화
  const handleSelectCompany = (company) => {
    setSelectedCompany(company)
    setSelectedWorkplace(null)
    localStorage.setItem('mes_company', JSON.stringify(company))
    localStorage.removeItem('mes_workplace')
  }

  const handleSelectWorkplace = (workplace) => {
    setSelectedWorkplace(workplace)
    localStorage.setItem('mes_workplace', JSON.stringify(workplace))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    if (!selectedCompany) {
      setError('회사를 선택해주세요.')
      return
    }
    if (!selectedWorkplace) {
      setError('사업장을 선택해주세요.')
      return
    }
    if (!userId.trim() || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      const COMP = selectedCompany.companyCode
      const FACT = selectedWorkplace.workplaceCode

      const data = await login(userId, password, COMP, FACT)

      if (remember) {
        localStorage.setItem('mes_uid', userId)
      } else {
        localStorage.removeItem('mes_uid')
      }

      localStorage.setItem('mes_token', data.token)
      localStorage.setItem('mes_user', JSON.stringify(data.user))

      // 전역 컨텍스트에 COMP / FACT 저장
      setSession({ COMP, FACT })

      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || '로그인에 실패했습니다.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="login-bg d-flex align-items-center justify-content-center min-vh-100">
        <div className="card login-card shadow">
          <div className="card-body p-4 p-md-5">

            {/* 로고 영역 */}
            <div className="text-center mb-4">
              <div className="login-logo d-inline-flex align-items-center gap-2 px-3 py-2 rounded mb-3">
                <span className="login-logo-icon">M</span>
                <span className="login-logo-text">MES SYSTEM</span>
              </div>
              <h5 className="fw-semibold mb-1">로그인</h5>
              <p className="text-muted small mb-0">
                제조 실행 시스템
                <span className="badge bg-success ms-2" style={{ fontSize: '0.7rem' }}>PROD</span>
              </p>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2" role="alert">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                {error}
              </div>
            )}

            {/* 로그인 폼 */}
            <form onSubmit={handleLogin} noValidate>

              {/* ── 회사 선택 ── */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  회사
                  <span className="text-danger ms-1">*</span>
                </label>
                <div
                  className={`select-field ${selectedCompany ? 'selected' : ''}`}
                  onClick={() => !loading && setShowCompanyModal(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && setShowCompanyModal(true)}
                >
                  {selectedCompany ? (
                    <div className="select-field-value">
                      <span className="select-field-code">{selectedCompany.companyCode}</span>
                      <span className="select-field-name">{selectedCompany.companyName}</span>
                    </div>
                  ) : (
                    <span className="select-field-placeholder">회사를 선택하세요</span>
                  )}
                  <svg className="select-field-icon" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
                  </svg>
                </div>
              </div>

              {/* ── 사업장 선택 ── */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  사업장
                  <span className="text-danger ms-1">*</span>
                </label>
                <div
                  className={`select-field ${selectedWorkplace ? 'selected' : ''} ${!selectedCompany ? 'disabled' : ''}`}
                  onClick={() => {
                    if (!loading && selectedCompany) setShowWorkplaceModal(true)
                    else if (!selectedCompany) setError('회사를 먼저 선택해주세요.')
                  }}
                  role="button"
                  tabIndex={selectedCompany ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading && selectedCompany) setShowWorkplaceModal(true)
                  }}
                >
                  {selectedWorkplace ? (
                    <div className="select-field-value">
                      <span className="select-field-code">{selectedWorkplace.workplaceCode}</span>
                      <span className="select-field-name">{selectedWorkplace.workplaceName}</span>
                    </div>
                  ) : (
                    <span className="select-field-placeholder">
                      {selectedCompany ? '사업장을 선택하세요' : '회사를 먼저 선택해주세요'}
                    </span>
                  )}
                  <svg className="select-field-icon" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
                  </svg>
                </div>
              </div>

              {/* 사용자 ID */}
              <div className="mb-3">
                <label htmlFor="userId" className="form-label small fw-semibold">
                  사용자 ID
                </label>
                <input
                  type="text"
                  id="userId"
                  className="form-control"
                  placeholder="아이디를 입력하세요"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                />
              </div>

              {/* 비밀번호 */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label small fw-semibold">
                  비밀번호
                </label>
                <div className="input-group">
                  <input
                    type={showPw ? 'text' : 'password'}
                    id="password"
                    className="form-control"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPw(!showPw)}
                    tabIndex={-1}
                  >
                    {showPw ? (
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label className="form-check-label small" htmlFor="remember">
                    아이디 저장
                  </label>
                </div>
                <a href="#" className="small text-decoration-none text-primary">
                  비밀번호 찾기
                </a>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </button>
            </form>

            {/* 하단 문의 */}
            <div className="text-center mt-4">
              <small className="text-muted">
                문의: 시스템 관리자 &nbsp;|&nbsp; IT팀 내선 1234
              </small>
            </div>

          </div>
        </div>
      </div>

      {/* 팝업 모달 */}
      <CompanySearchModal
        show={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        onSelect={handleSelectCompany}
      />
      <WorkplaceSearchModal
        show={showWorkplaceModal}
        onClose={() => setShowWorkplaceModal(false)}
        onSelect={handleSelectWorkplace}
        company={selectedCompany}
      />
    </>
  )
}

export default Login
