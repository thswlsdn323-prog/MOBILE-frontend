/**
 * API 공통 유틸리티
 *
 * 모든 업무 훅에서 반복되는 에러 메시지 추출 로직과
 * 날짜 형식 변환을 한 곳에서 관리합니다.
 */

/**
 * axios 에러 객체에서 사용자에게 표시할 한국어 메시지를 추출합니다.
 *
 * 우선순위:
 *   1. 백엔드가 내려준 response.data.message
 *   2. HTTP 상태 텍스트 (statusText)
 *   3. 네트워크/타임아웃 등 axios 자체 메시지
 *   4. 위 모두 없을 때의 기본 메시지
 *
 * @param {unknown} err - catch 블록에서 잡힌 에러 객체
 * @param {string}  [fallback='데이터를 불러오는 중 오류가 발생했습니다.'] - 기본 메시지
 * @returns {string} 사용자에게 보여줄 한국어 에러 메시지
 */
export function extractErrorMessage(
  err,
  fallback = '데이터를 불러오는 중 오류가 발생했습니다.',
) {
  return (
    err?.response?.data?.message ||
    err?.response?.statusText ||
    err?.message ||
    fallback
  )
}

/**
 * 'YYYY-MM-DD' 형식의 날짜 문자열에서 하이픈을 제거해 'YYYYMMDD' 형식으로 변환합니다.
 * 백엔드 파라미터가 하이픈 없는 날짜를 요구할 때 사용합니다.
 *
 * @param {string} dateStr - 'YYYY-MM-DD' 형식 날짜
 * @returns {string} 'YYYYMMDD' 형식 날짜
 *
 * @example
 * toApiDate('2026-05-04') // → '20260504'
 */
export function toApiDate(dateStr) {
  return dateStr.replace(/-/g, '')
}

/**
 * 응답 데이터에서 배열을 안전하게 추출합니다.
 * 백엔드 응답이 배열 직접 반환 또는 { data: [...] } 래핑 형태 모두를 처리합니다.
 *
 * @param {unknown} responseData - axios response.data
 * @returns {Array} 추출된 배열 (실패 시 빈 배열)
 */
export function extractList(responseData) {
  if (Array.isArray(responseData)) return responseData
  if (Array.isArray(responseData?.data)) return responseData.data
  return []
}
