import api from './api'

// 로그인
export const login = async (userId, password) => {
  const response = await api.post('/api/auth/login', { userId, password })
  return response.data
}

// 로그아웃
export const logout = async () => {
  try {
    await api.post('/api/auth/logout')
  } finally {
    localStorage.removeItem('mes_token')
    localStorage.removeItem('mes_user')
  }
}

// 내 정보 조회
export const getMe = async () => {
  const response = await api.get('/api/auth/me')
  return response.data
}
