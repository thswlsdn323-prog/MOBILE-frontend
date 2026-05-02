import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useDashboard() {
  const navigate = useNavigate()
  const [showQr, setShowQr] = useState(false)
  const [qrResult, setQrResult] = useState(null)

  const user = JSON.parse(localStorage.getItem('mes_user') || '{}')

  const handleQrScan = (result) => {
    setQrResult(result)
    setShowQr(false)
  }

  const handleQrClose = () => setShowQr(false)
  const handleQrResultClose = () => setQrResult(null)
  const handleOpenQr = () => setShowQr(true)

  const topCards = [
    {
      id: 'qr',
      icon: 'qr',
      label: 'QR 스캔',
      desc: '작업지시 / 자재 조회',
      color: '#4f8ef7',
      bg: '#eef4ff',
      action: handleOpenQr,
    },
    {
      id: 'prod',
      icon: 'prod',
      label: '생산 현황',
      desc: '실시간 생산 모니터링',
      color: '#20c997',
      bg: '#eafaf5',
      action: () => {},
    },
    {
      id: 'equip',
      icon: 'equip',
      label: '설비 상태',
      desc: '설비 가동 현황',
      color: '#fd7e14',
      bg: '#fff4e6',
      action: () => {},
    },
    {
      id: 'quality',
      icon: 'quality',
      label: '품질 지표',
      desc: '불량률 / 검사 현황',
      color: '#e83e8c',
      bg: '#fdf0f7',
      action: () => {},
    },
  ]

  const warehouseCards = [
    { label: '입고관리',     path: '/receiving',         color: '#4f8ef7', bg: '#eef4ff' },
    { label: '입고내역조회', path: '/receiving-history',  color: '#4f8ef7', bg: '#e8f0ff' },
    { label: '출고관리',     path: '/release',           color: '#20c997', bg: '#eafaf5' },
    { label: '출고내역조회', path: '/release-history',    color: '#20c997', bg: '#e2f8f2' },
    { label: '출하관리',     path: '/shipment',          color: '#fd7e14', bg: '#fff4e6' },
    { label: '출하내역조회', path: '/shipment-history',   color: '#fd7e14', bg: '#ffeedd' },
  ]

  const summaryCards = [
    { label: '금일 생산량', value: '-', unit: 'EA' },
    { label: '가동률',      value: '-', unit: '%' },
    { label: '불량률',      value: '-', unit: '%' },
    { label: '작업지시',    value: '-', unit: '건' },
  ]

  return {
    user,
    showQr,
    qrResult,
    topCards,
    warehouseCards,
    summaryCards,
    handleQrScan,
    handleQrClose,
    handleQrResultClose,
    navigate,
  }
}
