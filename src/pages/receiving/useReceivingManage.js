import { useState } from 'react'

// QR 테스트 데이터 (실제 QR 코드에 담기는 JSON 문자열 샘플)
const TEST_QR_DATA = [
  '{"itemCode":"MAT-001","itemName":"알루미늄 프레임 A형","qty":50,"unit":"EA","supplier":"㈜한국금속","lotNo":"LOT-2026-0501"}',
  '{"itemCode":"MAT-002","itemName":"스테인리스 볼트 M8","qty":200,"unit":"EA","supplier":"대성부품㈜","lotNo":"LOT-2026-0502"}',
  '{"itemCode":"MAT-003","itemName":"고무 패킹 30mm","qty":100,"unit":"EA","supplier":"한성고무㈜","lotNo":"LOT-2026-0503"}',
]

let recvSeq = 3  // 초기 테스트 데이터 이후 시퀀스

function genReceivingNo() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  return `RCV-${today}-${String(recvSeq++).padStart(3, '0')}`
}

export function useReceivingManage() {
  const [showScanner, setShowScanner]   = useState(false)
  const [scannedData, setScannedData]   = useState(null)
  const [searchDate, setSearchDate]     = useState(new Date().toISOString().slice(0, 10))
  const [searchItemCode, setSearchItemCode] = useState('')
  const [receivingList, setReceivingList] = useState([
    {
      recvNo: 'RCV-20260502-001',
      recvDate: '2026-05-02',
      itemCode: 'MAT-001',
      itemName: '알루미늄 프레임 A형',
      qty: 30,
      unit: 'EA',
      supplier: '㈜한국금속',
      lotNo: 'LOT-2026-0499',
      status: 'C',
    },
    {
      recvNo: 'RCV-20260502-002',
      recvDate: '2026-05-02',
      itemCode: 'MAT-004',
      itemName: '철판 2T×1000',
      qty: 10,
      unit: 'PCS',
      supplier: '포스코통상㈜',
      lotNo: 'LOT-2026-0500',
      status: 'P',
    },
  ])

  // QR 스캔 성공 콜백
  const handleScan = (text) => {
    setShowScanner(false)
    try {
      const parsed = JSON.parse(text)
      setScannedData(parsed)
    } catch {
      setScannedData({ itemCode: text, itemName: '', qty: 1, unit: 'EA', supplier: '', lotNo: '' })
    }
  }

  // 테스트 스캔 (카메라 없이 랜덤 샘플 데이터 사용)
  const handleTestScan = () => {
    const sample = TEST_QR_DATA[Math.floor(Math.random() * TEST_QR_DATA.length)]
    handleScan(sample)
  }

  // 입고 등록 확정
  const handleConfirm = (formData) => {
    const newEntry = {
      recvNo: genReceivingNo(),
      recvDate: new Date().toISOString().slice(0, 10),
      ...formData,
      status: 'P',
    }
    setReceivingList(prev => [newEntry, ...prev])
    setScannedData(null)
  }

  // 검색 초기화
  const handleReset = () => {
    setSearchDate(new Date().toISOString().slice(0, 10))
    setSearchItemCode('')
  }

  // 실시간 필터
  const filtered = receivingList.filter(r =>
    r.recvDate === searchDate &&
    r.itemCode.toLowerCase().includes(searchItemCode.toLowerCase())
  )

  // 상태 표시 헬퍼
  const statusLabel = (s) =>
    s === 'C' ? { text: '완료',   cls: 'text-success' }
    : s === 'P' ? { text: '처리중', cls: 'text-primary' }
    :             { text: '취소',   cls: 'text-danger'  }

  return {
    showScanner, setShowScanner,
    scannedData, setScannedData,
    searchDate,  setSearchDate,
    searchItemCode, setSearchItemCode,
    receivingList,
    filtered,
    statusLabel,
    handleScan,
    handleTestScan,
    handleConfirm,
    handleReset,
  }
}
