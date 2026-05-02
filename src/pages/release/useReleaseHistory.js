import { useState } from 'react'

const today = new Date().toISOString().slice(0, 10)
const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)

export function useReleaseHistory() {
  const [startDate,    setStartDate]    = useState(weekAgo)
  const [endDate,      setEndDate]      = useState(today)
  const [itemCode,     setItemCode]     = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dataList] = useState([])  // TODO: API 연동 시 교체

  const handleReset = () => {
    setStartDate(weekAgo)
    setEndDate(today)
    setItemCode('')
    setStatusFilter('')
  }

  const handleSearch = () => {
    // TODO: API 호출 로직 추가
  }

  const counts = {
    total:    dataList.length,
    complete: dataList.filter(r => r.status === 'C').length,
    progress: dataList.filter(r => r.status === 'P').length,
    cancel:   dataList.filter(r => r.status === 'X').length,
  }

  return {
    startDate,    setStartDate,
    endDate,      setEndDate,
    itemCode,     setItemCode,
    statusFilter, setStatusFilter,
    dataList,
    counts,
    handleReset,
    handleSearch,
  }
}
