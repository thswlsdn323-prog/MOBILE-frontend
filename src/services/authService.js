import api from './api'

// 로그인 (회사코드, 사업장코드 포함)
export const login = async (userId, password, COMP, FACT) => {
  const response = await api.post('/api/auth/login', {
    userId,
    password,
    COMP,
    FACT,
  })
  return response.data
}

// 로그아웃
export const logout = async () => {
  try {
    await api.post('/api/auth/logout')
  } finally {
    localStorage.removeItem('mes_token')
    localStorage.removeItem('mes_user')
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
