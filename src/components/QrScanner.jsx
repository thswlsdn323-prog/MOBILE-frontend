import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

function QrScanner({ onScan, onClose }) {
  const scannerRef = useRef(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const scannerId = 'qr-reader'
    const html5QrCode = new Html5Qrcode(scannerId)
    scannerRef.current = html5QrCode

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: 'environment' },       // 후면 카메라 우선
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // QR 인식 성공 → 스캐너 멈추고 결과 전달
            html5QrCode.stop().then(() => {
              onScan(decodedText)
            })
          },
          () => {}  // 인식 중 오류는 무시 (매 프레임 호출됨)
        )
      } catch (err) {
        setError('카메라를 사용할 수 없습니다. 브라우저 카메라 권한을 확인해주세요.')
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const handleClose = () => {
    if (scannerRef.current?.isScanning) {
      scannerRef.current.stop().then(() => onClose()).catch(() => onClose())
    } else {
      onClose()
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.88)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>

      {/* 헤더 */}
      <div className="d-flex align-items-center justify-content-between mb-3"
           style={{ width: '100%', maxWidth: 460 }}>
        <div className="d-flex align-items-center gap-2">
          <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3m0 4h4m-4 0v-4m-3 4h-1m1-4h-1v-1"/>
          </svg>
          <span className="text-white fw-semibold" style={{ fontSize: 17 }}>QR 코드 스캔</span>
        </div>
        <button className="btn btn-outline-light btn-sm px-3" onClick={handleClose}>
          닫기
        </button>
      </div>

      {/* 스캐너 뷰 */}
      <div style={{
        width: '100%', maxWidth: 460,
        borderRadius: 12, overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.2)',
      }}>
        <div id="qr-reader" style={{ width: '100%' }} />
      </div>

      {/* 안내 문구 */}
      <div className="mt-3 text-center" style={{ maxWidth: 460 }}>
        {error ? (
          <div className="alert alert-danger py-2 small mb-0">{error}</div>
        ) : (
          <small className="text-white-50">
            카메라를 QR 코드에 가져다 대면 자동으로 인식됩니다
          </small>
        )}
      </div>

    </div>
  )
}

export default QrScanner
