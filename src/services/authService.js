import api, { clearTokens } from './api'

// 로그인 (회사코드, 사업장코드 포함)
// 응답: { accessToken, refreshToken, user }
export const login = async (userId, password, COMP, FACT) => {
  const response = await api.post('/api/auth/login', {
    userId,
    password,
    COMP,
    FACT,
  })
  return response.data
}

// 로그아웃: 서버에 refresh token 폐기 요청 후 로컬 클리어
export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('mes_refresh_token')
    await api.post('/api/auth/logout', { refreshToken })
  } finally {
    clearTokens()
    localStorage.removeItem('mes_company')
    localStorage.removeItem('mes_workplace')
  }
}

// 내 정보 조회
export const getMe = async () => {
  const response = await api.get('/api/auth/me')
  return response.data
}

// 회사 목록 조회 (백엔드 연동 시 사용)
// export const getCompanies = async () => {
//   const response = await api.get('/api/companies')
//   return response.data
// }

// 사업장 목록 조회 (백엔드 연동 시 사용)
// export const getWorkplaces = async (companyCode) => {
//   const response = await api.get(`/api/companies/${companyCode}/workplaces`)
//   return response.data
// }
