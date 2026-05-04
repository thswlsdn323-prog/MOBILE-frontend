import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [COMP, setCOMP] = useState('')
  const [FACT, setFACT] = useState('')

  // 앱 시작 시 localStorage에서 복원 (새로고침 대비)
  useEffect(() => {
    const saved = localStorage.getItem('mes_session')
    if (saved) {
      try {
        const { COMP: c, FACT: f } = JSON.parse(saved)
        if (c) setCOMP(c)
        if (f) setFACT(f)
      } catch {
        // 파싱 실패 시 무시
      }
    }
  }, [])

  /** 로그인 성공 시 호출 – COMP/FACT를 한 번에 세팅 */
  const setSession = ({ COMP: c, FACT: f }) => {
    setCOMP(c)
    setFACT(f)
    localStorage.setItem('mes_session', JSON.stringify({ COMP: c, FACT: f }))
  }

  /** 로그아웃 시 호출 */
  const clearSession = () => {
    setCOMP('')
    setFACT('')
    localStorage.removeItem('mes_session')
  }

  return (
    <AppContext.Provider value={{ COMP, FACT, setSession, clearSession }}>
      {children}
    </AppContext.Provider>
  )
}

/** 편의 훅 */
export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
