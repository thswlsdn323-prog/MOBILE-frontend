/**
 * server.js
 * MES 시스템 백엔드 서버 진입점
 *
 * 실행 방법:
 *   개발: npm run dev   (nodemon 자동 재시작)
 *   운영: npm start
 *
 * 환경변수: server/.env 파일 필요 (.env.example 참고)
 */

require('dotenv').config()

const express = require('express')
const cors    = require('cors')
const helmet  = require('helmet')
const morgan  = require('morgan')

const authRouter = require('./routes/auth')

const app  = express()
const PORT = process.env.PORT || 3000

// ── 보안 헤더 ────────────────────────────────────────────────
app.use(helmet())

// ── CORS 설정 ────────────────────────────────────────────────
// 개발 중에는 Vite 개발서버(12345) 허용
// 운영 환경에서는 실제 도메인으로 제한하세요
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGIN || 'http://localhost'
    : ['http://localhost:12345', 'https://localhost:12345'],
  credentials: true,
}))

// ── 요청 파싱 ────────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ── HTTP 요청 로깅 ───────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ── 라우터 등록 ──────────────────────────────────────────────
app.use('/api/auth', authRouter)

// ── 헬스 체크 ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ── 404 핸들러 ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` })
})

// ── 전역 에러 핸들러 ─────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Server Error]', err)
  res.status(500).json({ success: false, message: '서버 내부 오류가 발생했습니다.' })
})

// ── 서버 시작 ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 MES 백엔드 서버 실행 중 → http://localhost:${PORT}`)
  console.log(`   환경: ${process.env.NODE_ENV || 'development'}`)
  console.log(`   JWT 만료: ${process.env.JWT_EXPIRES_IN || '8h'}\n`)
})

module.exports = app
