import { useState } from 'react'

export function useReleaseManage() {
  const [searchDate,     setSearchDate]     = useState(new Date().toISOString().slice(0, 10))
  const [searchItemCode, setSearchItemCode] = useState('')
  const [dataList] = useState([])  // TODO: API 연동 시 교체

  const handleReset = () => {
    setSearchDate(new Date().toISOString().slice(0, 10))
    setSearchItemCode('')
  }

  const handleSearch = () => {
    // TODO: API 호출 로직 추가
  }

  const filtered = dataList.filter(r =>
    r.releaseDate === searchDate &&
    r.itemCode.toLowerCase().includes(searchItemCode.toLowerCase())
  )

  return {
    searchDate,     setSearchDate,
    searchItemCode, setSearchItemCode,
    filtered,
    handleReset,
    handleSearch,
  }
}
