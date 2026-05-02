import { useState } from 'react'

export function useShipmentManage() {
  const [searchDate,     setSearchDate]     = useState(new Date().toISOString().slice(0, 10))
  const [searchSupplier, setSearchSupplier] = useState('')
  const [dataList] = useState([])  // TODO: API 연동 시 교체

  const handleReset = () => {
    setSearchDate(new Date().toISOString().slice(0, 10))
    setSearchSupplier('')
  }

  const handleSearch = () => {
    // TODO: API 호출 로직 추가
  }

  const filtered = dataList.filter(r =>
    r.shipDate === searchDate &&
    r.supplier.includes(searchSupplier)
  )

  return {
    searchDate,     setSearchDate,
    searchSupplier, setSearchSupplier,
    filtered,
    handleReset,
    handleSearch,
  }
}
