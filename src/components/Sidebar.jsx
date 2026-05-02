import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const menuGroups = [
  {
    group: '입고',
    color: '#4f8ef7',
    bg: '#eef4ff',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    ),
    items: [
      { label: '입고관리', path: '/receiving' },
      { label: '입고내역조회', path: '/receiving-history' },
    ],
  },
  {
    group: '출고',
    color: '#20c997',
    bg: '#eafaf5',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    ),
    items: [
      { label: '출고관리', path: '/release' },
      { label: '출고내역조회', path: '/release-history' },
    ],
  },
  {
    group: '출하',
    color: '#fd7e14',
    bg: '#fff4e6',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 4v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    items: [
      { label: '출하관리', path: '/shipment' },
      { label: '출하내역조회', path: '/shipment-history' },
    ],
  },
]

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [openGroups, setOpenGroups] = useState({ '입고': true, '출고': true, '출하': true })

  const toggleGroup = (group) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  const handleNavigate = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1040,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* 사이드바 패널 */}
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, bottom: 0,
          width: 260,
          background: '#1a2236',
          zIndex: 1050,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.25)' : 'none',
        }}
      >
        {/* 사이드바 헤더 */}
        <div style={{
          padding: '16px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: '#4f8ef7',
              borderRadius: 8, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15,
            }}>M</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, letterSpacing: '0.04em' }}>MES SYSTEM</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>창고관리 메뉴</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none', borderRadius: 6,
              width: 30, height: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* 메뉴 목록 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {menuGroups.map((group) => (
            <div key={group.group} style={{ marginBottom: 4 }}>
              {/* 그룹 헤더 */}
              <button
                onClick={() => toggleGroup(group.group)}
                style={{
                  width: '100%',
                  background: 'none', border: 'none',
                  display: 'flex', alignItems: 'center',
                  padding: '10px 18px',
                  cursor: 'pointer',
                  gap: 10,
                }}
              >
                <div style={{
                  width: 30, height: 30,
                  background: group.bg,
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: group.color,
                  flexShrink: 0,
                }}>
                  {group.icon}
                </div>
                <span style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 600, fontSize: 13,
                  flex: 1, textAlign: 'left',
                }}>
                  {group.group}관리
                </span>
                <svg
                  width="14" height="14"
                  fill="none" stroke="rgba(255,255,255,0.4)"
                  strokeWidth="2" viewBox="0 0 24 24"
                  style={{
                    transition: 'transform 0.2s',
                    transform: openGroups[group.group] ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {/* 그룹 아이템 */}
              {openGroups[group.group] && (
                <div style={{ paddingLeft: 18, paddingRight: 12, paddingBottom: 4 }}>
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        style={{
                          width: '100%',
                          background: isActive
                            ? `linear-gradient(90deg, ${group.color}22, ${group.color}11)`
                            : 'none',
                          border: 'none',
                          borderLeft: isActive
                            ? `3px solid ${group.color}`
                            : '3px solid transparent',
                          borderRadius: '0 8px 8px 0',
                          display: 'flex', alignItems: 'center',
                          padding: '9px 14px',
                          cursor: 'pointer',
                          gap: 8,
                          marginBottom: 2,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                        }}
                        onMouseLeave={e => {
                          if (!isActive) e.currentTarget.style.background = 'none'
                        }}
                      >
                        <span style={{
                          color: isActive ? group.color : 'rgba(255,255,255,0.55)',
                          fontSize: 12.5,
                          fontWeight: isActive ? 600 : 400,
                        }}>
                          {item.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 하단 버전 */}
        <div style={{
          padding: '12px 18px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          color: 'rgba(255,255,255,0.25)',
          fontSize: 11,
        }}>
          MES Mobile v1.0
        </div>
      </div>
    </>
  )
}

export default Sidebar
