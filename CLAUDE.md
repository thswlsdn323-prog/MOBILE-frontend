# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # HTTPS dev server on port 12345
npm run build    # Production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

Dev server runs HTTPS (`@vitejs/plugin-basic-ssl`) and proxies `/api/*` and `/GR/*` to `http://localhost:3000` (backend).

## Architecture

**MES(제조실행시스템) 모바일 웹 프론트엔드** — React 19 + Vite + Bootstrap 5. 테스트 없음, 타입스크립트 없음.

### Auth flow

1. 앱 진입 시 `App.jsx`의 `PrivateRoute`가 `localStorage`의 `mes_token` JWT를 클라이언트 측 만료 확인
2. 유효하지 않으면 `/login`으로 리다이렉트, 모든 미매핑 경로도 `/login`으로 폴백
3. 로그인 성공 시 `mes_token`, `mes_user`, `mes_session`(COMP/FACT JSON) 저장
4. `api.js`의 axios 인스턴스가 모든 요청에 `Authorization: Bearer <token>` 자동 첨부, 401 응답 시 토큰 삭제 후 `/login` 리다이렉트

### Global context

`AppContext`는 `COMP`(회사코드)와 `FACT`(사업장코드) 두 값만 전역으로 관리. 로그인 화면에서 `setSession({ COMP, FACT })` 호출로 세팅되며, 새로고침 대비로 `mes_session` localStorage 키에도 저장.

### Page pattern

모든 업무 페이지는 **`use[PageName].js` + `[PageName].jsx`** 쌍으로 구성:
- `use*.js`: 상태, 필터링, API 호출 등 로직 전담
- `*.jsx`: `Layout` 컴포넌트로 감싸고 훅에서 반환한 값만 렌더링

`Layout`은 sticky 네비바 + 사이드바 + `children` 영역을 제공. 모든 업무 페이지에 반드시 사용.

### Business modules

| 경로 | 모듈 |
|------|------|
| `/receiving` | 입고관리 (QR 스캔) |
| `/receiving-history` | 입고이력 |
| `/release` | 불출관리 |
| `/release-history` | 불출이력 |
| `/shipment` | 출하관리 |
| `/shipment-history` | 출하이력 |

### QR 스캔

`html5-qrcode` 라이브러리 기반 `QrScanner` 컴포넌트. 카메라 없이 개발할 때는 각 페이지의 "테스트 스캔" 버튼으로 하드코딩된 샘플 JSON 데이터를 주입. QR 데이터는 `{ itemCode, itemName, qty, unit, supplier, lotNo }` JSON 형식.

### 현재 데이터 상태

백엔드 연동이 부분적으로 진행 중. 각 `use*.js` 훅의 상태 초기값이 하드코딩된 더미 데이터로 채워져 있으며, API 연동 후 이 부분을 교체해야 함. `authService.js`에 주석처리된 `getCompanies`, `getWorkplaces` 함수가 있음.

## Database Schema (MSSQL — DB명: MOBILE)

### 테이블 접두사 규칙

| 접두사 | 용도 | 예시 |
|--------|------|------|
| `BC_` | 공통 마스터 (회사·부서·직원·사용자·코드) | BC_COMP, BC_USER |
| `MA_` | 설비·기계 | MA_MACHINE, MA_REPAIR |
| `TB_` | 기준정보 (품목·창고·위치·거래처·BOM) | TB_ITEM, TB_WH, TB_LOC |
| `TM_` | 거래 마스터 (수주·발주·생산계획) | TM_SO_H/D, TM_PO_H/D |
| `TW_` | 작업 트랜잭션 (입고·불출·재고·생산실적) | TW_GR_H/D, TW_GI_H/D |

### 컬럼 명명 규칙

| 패턴 | 의미 | 비고 |
|------|------|------|
| `COMP` / `COMP_CD` | 회사코드 | BC_ 테이블은 `COMP_CD`, 나머지는 `COMP` |
| `FACT` / `FACT_CD` | 사업장코드 | 동일 패턴 |
| `_CD` | 코드 | ITEM_CD, WH_CD, DEPT_CD |
| `_NM` | 이름(한국어) | `_NM_ENG`, `_NM_JPN` 다국어 파생 |
| `_NO` | 전표번호 varchar(12) | GR_NO, GI_NO, SO_NO, PO_NO |
| `_SQ` | 전표 순번 int | GR_SQ, GI_SQ, SO_SQ |
| `_DT` | 날짜 varchar(8) YYYYMMDD | GR_DT, PO_DT |
| `_DTS` | 날짜시간 datetime (BC_ 전용) | INSERT_DTS, UPDATE_DTS |
| `M_ID` / `M_IL` | 등록자 / 등록일시 (TB_·TM_·TW_) | BC_ 계열은 INSERT_ID/INSERT_DTS |
| `U_ID` / `U_IL` | 수정자 / 수정일시 (TB_·TM_·TW_) | BC_ 계열은 UPDATE_ID/UPDATE_DTS |
| `STAT` | 상태 char(1) | 전 테이블 공통 |
| `_YN` | Y/N 플래그 char(1) | USE_YN, ADD_YN 등 |
| `_QTY` | 수량 numeric(17,6) | PLAN_QTY, IN_QTY |
| `_PRICE` | 단가 numeric(17,6) | UNIT_PRICE |
| `LOT_NB` | 로트번호 | (LOT_NO 아님 주의) |
| `_H` / `_D` | 헤더 / 상세 테이블 쌍 | TW_GR_H + TW_GR_D |

### MES 모듈별 주요 테이블

| 모듈 | 헤더 | 상세 | 비고 |
|------|------|------|------|
| 입고(GR) | TW_GR_H | TW_GR_D | PO_NO로 발주 연결 |
| 불출(GI) | TW_GI_H | TW_GI_D | REQ_NO로 요청 연결 |
| 재고조정 | TW_ADJUST_H | TW_ADJUST_D | ADJUST_TYPE: I=입고조정, O=출고조정 |
| 재고현황 | TW_INVENTORY | — | WORK_DT 기준 일별 집계 |
| 생산실적 | TW_RESULT_H | TW_RESULT_D | _S(검사), _W(작업자) 추가 테이블 |
| 수주 | TM_SO_H | TM_SO_D | |
| 발주 | TM_PO_H | TM_PO_D | |
| 생산계획 | TM_PRODUCTION_PLAN | — | PLAN_NO 기준 |

### 기준정보 주요 테이블

| 테이블 | 설명 | PK |
|--------|------|-----|
| TB_ITEM | 품목 마스터 | COMP, ITEM_CD |
| TB_WH | 창고 마스터 | COMP, FACT, WH_CD |
| TB_LOC | 위치(로케이션) | COMP, FACT, WH_CD, LC_CD |
| TB_CUST | 거래처 | COMP, FACT, CUST_CD |
| TB_BOM | BOM | COMP, FACT, ITEM_CD, SEQ |
| BC_SYSCODE | 공통코드 | GRP_CD, CODE |
| BC_SYSCODE_GRP | 공통코드 그룹 | GRP_CD |
