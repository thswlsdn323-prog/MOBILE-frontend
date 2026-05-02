import { useState, useCallback } from 'react'
import api from '../../services/api'

const today   = new Date().toISOString().slice(0, 10)
const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)

export function useReceivingHistory() {
  // ── 검색 조건 ──────────────────────────────────────────────────────────────
  const [startDate,    setStartDate]    = useState(weekAgo)
  const [endDate,      setEndDate]      = useState(today)
  const [itemCode,     setItemCode]     = useState('')   // 품번
  const [itemName,     setItemName]     = useState('')   // 품명
  const [spec,         setSpec]         = useState('')   // 규격
  const [statusFilter, setStatusFilter] = useState('')

  // ── 결과 / UI 상태 ─────────────────────────────────────────────────────────
  const [dataList,  setDataList]  = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState(null)

  // ── API 조회 ───────────────────────────────────────────────────────────────
  const handleSearch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = {
        fromDate: startDate,
        toDate:   endDate,
        itemCode: itemCode.trim(),
        itemName: itemName.trim(),
        spec:     spec.trim(),
      }

      const res = await api.get('/GR/GrSearch', { params })

      // 응답 형태에 맞게 조정 – 배열 또는 { data: [...] } 모두 처리
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : []

      // 상태 필터 클라이언트 측 적용 (statusFilter 선택 시)
      const filtered = statusFilter
        ? list.filter(r => r.status === statusFilter)
        : list

      setDataList(filtered)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.statusText     ||
        '데이터를 불러오는 중 오류가 발생했습니다.'
      )
      setDataList([])
    } finally {
      setIsLoading(false)
    }
  }, [startDate, endDate, itemCode, itemName, spec, statusFilter])

  // ── 검색 조건 초기화 ───────────────────────────────────────────────────────
  const handleReset = () => {
    setStartDate(weekAgo)
    setEndDate(today)
    setItemCode('')
    setItemName('')
    setSpec('')
    setStatusFilter('')
    setDataList([])
    setError(null)
  }

  // ── 카운트 집계 ────────────────────────────────────────────────────────────
  const counts = {
    total:    dataList.length,
    complete: dataList.filter(r => r.status === 'C').length,
    progress: dataList.filter(r => r.status === 'P').length,
    cancel:   dataList.filter(r => r.status === 'X').length,
  }

  return {
    // 검색 조건
    startDate,    setStartDate,
    endDate,      setEndDate,
    itemCode,     setItemCode,
    itemName,     setItemName,
    spec,         setSpec,
    statusFilter, setStatusFilter,
    // 결과 / UI 상태
    dataList,
    counts,
    isLoading,
    error,
    // 핸들러
    handleSearch,
    handleReset,
  }
}
